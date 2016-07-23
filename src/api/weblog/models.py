from django.db import models
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete, m2m_changed
from user.models import User
from django.template.defaultfilters import slugify

from django.core.cache import cache

from django.db.models.signals import post_save
from django.dispatch import receiver

from librairy.models import Picture

from weblog.slug import unique_slugify
from weblog.utils import format_abstract, format_content



class PublishedManager(models.Manager):
    """
    Returns a query set with all published posts.
    """
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(
                pub_date__lte=timezone.now(),
                draft=False).select_related('author')



class Post(models.Model):
    """
    Table for weblog posts entries.
    """
    title = models.CharField(max_length=254, verbose_name="Title")
    slug = models.CharField(max_length=270, db_index=True, unique=True)
    description = models.CharField(max_length=254, null=True, blank=True,
        verbose_name="Description",
        help_text=(
            "Description of the post, in one sentence, "
            "some kind of subtitle."
        ))
    abstract = models.TextField(null=True, blank=True,
            verbose_name="Abstract")
    content = models.TextField(null=True, blank=True,
            verbose_name="Content")
    source = models.TextField(null=True, blank=True,
        verbose_name="Post content, in markdown")
    tags = models.ManyToManyField('Tag', blank=True,
            verbose_name="Tags")
    pictures = models.ManyToManyField(Picture, blank=True,
            through='PostPicture',
            verbose_name="Pictures")
    author = models.ForeignKey(User)
    draft = models.BooleanField(default=False, db_index=True,
            verbose_name="Draft")
    create_date = models.DateTimeField(auto_now_add=True,
            verbose_name="First redaction date")
    update_date = models.DateTimeField(auto_now=True,
            verbose_name="Last modification date")
    pub_date = models.DateTimeField(blank=True, db_index=True,
        verbose_name="Publication date")


    # add generic relation to pictures
    # add number of pictures

    ## managers
    objects = models.Manager()
    published = PublishedManager()



    class Meta:
        ordering = ['-pub_date']


    def get_pictures(self):
        """
        Returns all related pictures ordered by "PostPicture.order"
        """
        return PostPicture.objects.filter(post=self)



    def get_next_published(self):
        """
        Returns next published post.
        """
        try:
            return self.get_next_by_pub_date(
                pub_date__lte=timezone.now(),
                draft=False
            )
        except self.DoesNotExist:
            return None



    def get_previous_published(self):
        """
        Returns previous published post
        """
        try:
            return self.get_previous_by_pub_date(
                    pub_date__lte=timezone.now(),
                    draft=False
            )
        except self.DoesNotExist:
            return None





    def get_next(self):
        """
        Returns next post, published or not.
        """
        try:
            return self.get_next_by_pub_date()
        except self.DoesNotExist:
            return None





    def get_previous(self):
        """
        Returns previous post, published or not.
        """
        try:
            return self.get_previous_by_pub_date()
        except self.DoesNotExist:
            return None





    def save(self, **kwargs):
        """
        Set pub_date if created and no one,
        make unique slug from title with date,
        convert abstract and content md to html,
        set absolute url, set author then save.
        """
        # if create and pubdate hasn't been set by user
        if not self.pub_date:
            self.pub_date = timezone.now()
        # format slug with date like 2015/06/08/my-post-slug/
        slug = '{}/{}'.format(
                self.pub_date.strftime("%Y/%m/%d"),
                slugify(self.title)
            )
        unique_slugify(self, slug, slugify_value=False)
        # TODO import conf here and use abstract delimiter from it.
        self.abstract = format_abstract(self.source)
        self.content = format_content(self.source)

        super(Post, self).save()

    def __str__(self):
        return "{} - {}".format(self.pk, self.title)



@receiver(post_save, sender=Post)
def clear_cache(sender, **kwargs):
    cache.clear()


class PostPicture(models.Model):
    """
    Through table for post - pictures relation,
    add an order column.
    """
    post = models.ForeignKey(Post)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ('post', 'picture')




@receiver(post_save, sender=PostPicture)
def clear_cache(sender, **kwargs):
    cache.clear()



class UsedManager(models.Manager):
    """
    Returns a queryset with all tags with n_posts > 0.
    """
    def get_queryset(self):
        return super(UsedManager, self).get_queryset().filter(
                n_posts__gt= 0).order_by('-n_entry')



class Tag(models.Model):
    """
    Table for posts' tags.
    """
    name = models.CharField(max_length=50, verbose_name="Tag", unique=True)
    slug = models.SlugField(max_length=65, unique=True, db_index=True)
    n_posts = models.IntegerField(default=0, db_index=True)

    ## managers
    objects = models.Manager()
    used = UsedManager()

    class Meta:
        ordering = ['name']

    def set_n_posts(self):
        """Set number of posts."""
        self.n_posts = self.post_set(manager='published').all().count()
        self.save()

    def save(self, **kwargs):
        """Make unique slug from title, get number of posts then save."""
        slug = '{}'.format(self.name)
        unique_slugify(self, slug)
        super(Tag, self).save()

    def __str__(self):
        return "%s" % self.name



@receiver(post_save, sender=Post)
@receiver(post_delete, sender=Post)
@receiver(m2m_changed, sender=Post.tags.through)
def update_tags_n_posts(**kwargs):
    """Update tag's number of posts after post save or delete."""
    for tag in Tag.objects.all():
        tag.set_n_posts()
