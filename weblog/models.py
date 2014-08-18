from datetime import datetime

from django.utils import timezone
from django.db import models
from django.core.urlresolvers import reverse
from django.core.cache import cache
from django.core.mail import send_mail
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from user.models import User
from conf.models import Conf
from weblog.slug import unique_slugify
from stats.models import View
from librairy.models import Picture, PICTURES_ORDERING_CHOICES

## managers
class PublishedManager(models.Manager):
    """Returns a queryset with all published objects
    ordered by update date (nor draft, nor auto-draft, nor future pub_date)
    (for users lists)."""
    def get_query_set(self):
        return super(PublishedManager, self).get_query_set().filter(
                pub_date__lte = timezone.now,
                draft=False,
                auto_draft=False).order_by('-pub_update')


class NotDraftManager(models.Manager):
    """Returns a queryset with all objects which are not draft,
    ordered by update date (for admins lists)."""
    def get_query_set(self):
        return super(NotDraftManager, self).get_query_set().filter(
                draft=False,
                auto_draft=False).order_by('-pub_update')



## tables
class Entry(models.Model):
    """Table for all weblog entrys (weblog posts and portfolios)."""
    title = models.CharField(max_length=254, verbose_name="Titre")
    slug = models.SlugField(max_length=254)
    abstract = models.TextField(null=True, blank=True, verbose_name="Résumé")
    content = models.TextField(null=True, blank=True, verbose_name="Contenu")
    source = models.TextField(null=True, blank=True, verbose_name="Contenu du post")
    tags = models.ManyToManyField('Tag', verbose_name="Mots clés")
    pictures = models.ManyToManyField(Picture, through='Entry_pictures', 
            null=True, blank=True, verbose_name="Images")
    n_pict = models.PositiveIntegerField(default=0,
            verbose_name="Nombre d'images")
    order = models.CharField(max_length=150, null=True, blank=True,
            choices=PICTURES_ORDERING_CHOICES, default='name',
            verbose_name="Ordre")
    reversed_order = models.BooleanField(default=False,
            verbose_name="Classement décroissant")
    author = models.ForeignKey(User)

    portfolio = models.BooleanField(default=False,
            verbose_name="Le post est un portfolio")
    draft = models.BooleanField(default=False, verbose_name="Brouillon")
    auto_draft = models.BooleanField(default=True,
            verbose_name="Brouillon automatique")
    is_published = models.BooleanField(default=False,
            verbose_name="Le post a été publiée")
    absolute_url = models.URLField(verbose_name="Url absolue")

    date = models.DateTimeField(auto_now_add=True,
            auto_now=False,
            verbose_name="Date de rédaction") # date entry was created in table
    date_update = models.DateTimeField(auto_now_add=True,
            auto_now=True,
            verbose_name="Date de modification") # date of last modification
    pub_date = models.DateTimeField(blank=True,
            verbose_name="Date de publication") # date entry will be published
    # pub_update date entry was officially modified :
    #   a distinction is done between date_update, which change automatically
    #   at all modification, and pub_update, which change only on not "minor
    #   changes" modification, and is used to order entrys in the list.
    pub_update = models.DateTimeField(blank=True,
            verbose_name="Date de dernière modification")

    # managers
    objects = models.Manager()
    published = PublishedManager()
    not_draft = NotDraftManager()

    # views counter
    def get_n_view(self):
        return View.objects.filter(url=self.absolute_url).count()

    def get_n_view_not_staff(self):
        return View.objects.filter(url=self.absolute_url, staff=False).count()

    def get_n_view_unique(self):
        return View.objects.filter(url=self.absolute_url,
                staff=False).values('ip').distinct().count()

    # cache management
    def clear_cache(self):
        """
        Clear whole cache related to object:
        objects view lists where it appears (weblog list, tag list)
        feed cache
        sitemap cache.
        Useful for creation of a new object o for an update of it.
        """
        cache.clear()
        cache.close()

    # mails management
    def mail_followers(self):
        conf = Conf.objects.latest('date')
        followers = User.objects.filter(weblog_mail_newsletter = True)
        mails = [follower.email for follower in followers]
        subject = 'Nouvelle publication sur {0}'.format(conf.title)
        message = (
                "{0}\n\n"
                "http://{1}\n\n"
                "{2} vous informe des dernières activités du site.\n"
                "Pour modifier vos notifications, rendez-vous sur votre page de profil :\n"
                "http://{3}\n"
                ).format(self.title, conf.domain + self.absolute_url, conf.title, conf.domain + reverse('user_profil'))
        send_mail(subject, message, None, mails)
        self.is_published = True
        self.save()

    # functions to get absolute urls
    def get_absolute_url(self):
        if self.portfolio:
            return reverse('portfolio_view', kwargs={
                'slug': self.slug})
        else:
            print(self.pub_date.strftime("%Y/%m/%d"))
            return reverse('entry_view', kwargs={
                'date': self.pub_date.strftime("%Y/%m/%d"),
                'slug': self.slug})

    # pre-save function
    def save(self, **kwargs):
        """Make unique slug from title, get url and save"""
        slug = '%s' % (self.title)
        if self.portfolio:
            unique_slugify(self, slug,
                    queryset=Entry.objects.filter(portfolio=True))
        else:
            date = self.pub_date.strftime("%Y-%m-%d")
            queryset = Entry.objects.filter(portfolio=False,
                    pub_date__startswith=date)
            print(date)
            unique_slugify(self, slug,
                queryset=queryset)

        self.absolute_url = self.get_absolute_url()
        super(Entry, self).save()

    # Pictures ordering function
    @property
    def get_sorted_pictures(self):
        """Returns Picture objects queryset order by 'self.order'
        and reversed if 'self.reversed_order'"""
        if self.reversed_order:
            prefix = '-'
        else:
            prefix = ''

        if self.order == 'custom':
            return [entry.picture for entry in
                    Entry_pictures.objects.filter(entry=self)
                    .order_by(prefix + 'order')]
        else:
            return self.pictures.order_by(prefix + self.order)


    def __str__(self):
        return "%s" % self.title



@receiver(post_save, sender=Entry)
@receiver(post_delete, sender=Entry)
def count_tags_entrys(**kwargs):
    """update tag's entrys number."""
    for elem in Tag.objects.all():
        elem.n_entry = elem.entry_set.filter(
                is_published=True,
                draft=False,
                auto_draft=False).count()
        elem.save()



class Entry_pictures(models.Model):
    """Through table for entry's pictures relation,
    add an order column"""
    entry = models.ForeignKey(Entry)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ('order',)



class Tag(models.Model):
    """Entry's tags table."""
    name = models.CharField(max_length=50, verbose_name="Mot clé", unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    n_entry = models.IntegerField(default=0)
    absolute_url = models.URLField(verbose_name="Url absolue")

    class Meta:
        ordering = ['name']

    def get_absolute_url(self):
        return reverse('weblog_tag', kwargs={'slug': self.slug})

    def save(self, **kwargs):
        """Make unique slug from title, get url and save"""
        slug = '%s' % (self.name)
        unique_slugify(self, slug)
        self.absolute_url = self.get_absolute_url()
        super(Tag, self).save()


    def __str__(self):
        return "%s" % self.name








