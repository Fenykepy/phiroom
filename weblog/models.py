from datetime import datetime
from django.utils import timezone

from django.db import models
from django.core.urlresolvers import reverse
from django.core.cache import cache
from django.core.mail import send_mail

from mptt.models import MPTTModel, TreeForeignKey

from user.models import User
from conf.models import Conf
from weblog.slug import unique_slugify

class PublishedManager(models.Manager):
    """returns a queryset with all published objects
    (not draft, not auto_draft, and pub_date passed)."""
    def get_query_set(self):
        return super(PublishedManager, self).get_query_set().filter(pub_date__lte = timezone.now, draft=False, auto_draft=False).order_by('-pub_update')

class NotDraftManager(models.Manager):
    """returns a queryset with all objects which are not draft."""
    def get_query_set(self):
        return super(NotDraftManager, self).get_query_set().filter(draft=False, auto_draft=False).order_by('-pub_update')


class Entry(models.Model):
    """Ancestor table for webblog entrys"""
    title = models.CharField(max_length=100, verbose_name="Titre")
    slug = models.SlugField(max_length=100)
    abstract = models.TextField(null=True, verbose_name="Résumé")
    content = models.TextField(null=True, verbose_name="Contenu")
    source = models.TextField(null=True, verbose_name="Article")
    tags = models.ManyToManyField('Tag', verbose_name="Mots clés")
    author = models.ForeignKey(User)
    category = models.ForeignKey('Category', verbose_name="Catégorie")
    # date : date entry was add in table
    date = models.DateTimeField(auto_now_add=True, auto_now=False, verbose_name="Date de rédaction")
    # date_update : date entry was modified in table
    date_update = models.DateTimeField(auto_now_add=True, auto_now=True, verbose_name="Date de modification")
    # pub_date : date entry will be seen in public website
    pub_date = models.DateTimeField(blank=True, verbose_name="Date de publication")
    # pub_update : if entry is updated, and user want it to be again on top of last entrys, un check "minor change" in form.
    pub_update = models.DateTimeField(blank=True, verbose_name="Date de dernière modification")
    draft = models.BooleanField(default=False, verbose_name="Brouillon")
    auto_draft = models.BooleanField(default=False, verbose_name="Brouillon automatique")
    n_read = models.IntegerField(default=0, verbose_name="Nombre de lectures")
    is_article = models.BooleanField(default=False, verbose_name="L'entrée est un article")
    is_gallery = models.BooleanField(default=False, verbose_name="L'entrée est une galerie")
    is_portfolio = models.BooleanField(default=False, verbose_name="L'entrée est un portfolio")
    is_pictofday = models.BooleanField(default=False, verbose_name="L'entrée est une image du jour")
    is_published = models.BooleanField(default=False, verbose_name="L'entrée a été publiée")
    objects_entry = models.Manager()
    published_entry = PublishedManager()

    def get_absolute_url(self):
        if self.is_article:
            return self.article.get_absolute_url()
        elif self.is_gallery:
            return self.gallery.get_absolute_url()
        elif self.is_portfolio:
            return self.portfolio.get_absolute_url()
        elif self.is_pictofday:
            return self.pictofday.get_absolute_url()

    def clear_cache(self):
        """
        Clear whole cache related to object:
        object view
        lists where it appears (weblog list, tag list, category list)
        feed cache
        sitemap cache
        useful for creation of a new object or for big update of it.
        """
        cache.clear()
        cache.close()

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
                ).format(self.title, conf.domain + self.get_absolute_url(), conf.title, conf.domain + reverse('user_profil'))
        send_mail(subject, message, None, mails)
        self.is_published = True
        self.save()
        

    def save(self, **kwargs):
        """Make unique slug from title and save"""
        slug = '%s' % (self.title)
        unique_slugify(self, slug, queryset=Entry.objects_entry.all())
        super(Entry, self).save()

    def __str__(self):
        return "%s" % self.title


class Category(MPTTModel):
    """Articles category table"""
    name = models.CharField(max_length=30, verbose_name="Catégorie")
    slug = models.SlugField(max_length=30, verbose_name="slug")
    parent = TreeForeignKey('self', null=True, blank=True, related_name="Children")

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        unique_together = ('name', 'parent')

    def get_absolute_url(self):
        return reverse('weblog_cat', kwargs={'pk': self.id, 'cat': self.slug})

    def __str__(self):
        return self.name

class Tag(models.Model):
    """Articles tags table"""
    name = models.CharField(max_length=30, verbose_name="Mot clé", unique=True)
    slug = models.SlugField(max_length=30, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        """Make unique slug from name and save"""
        slug = '%s' % (self.name)
        unique_slugify(self, slug)
        super(Tag, self).save()

    def get_absolute_url(self):
        return reverse('weblog_tag', kwargs={'slug': self.slug})

