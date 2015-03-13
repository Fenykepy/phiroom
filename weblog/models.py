from django.db import models
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete, m2m_changed
from user.models import User
from django.template.defaultfilters import slugify

from weblog.slug import unique_slugify
from weblog.utils import format_abstract, format_content



class PublishedManager(models.Manager):
    """Returns a query set with all published posts."""
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(
                pub_date__lte=timezone.now,
                draft=False).select_related('author')



class Post(models.Model):
    """
    Table for weblog posts entrys.
    """
    title = models.CharField(max_length=254, verbose_name="Title")
    slug = models.CharField(max_length=270, db_index=True)
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
    tags = models.ManyToManyField('Tag', null=True, blank=True,
            verbose_name="Tags")
    author = models.ForeignKey(User)
    draft = models.BooleanField(default=False, db_index=True,
        verbose_name="Draft")
    create_date = models.DateTimeField(auto_now_add=True,
        auto_now=False, verbose_name="First redaction date")
    update_date = models.DateTimeField(auto_now_add=True,
        auto_now=True, verbose_name="Last modification date")
    pub_date = models.DateTimeField(blank=True, null=True, db_index=True,
        verbose_name="Publication date")
    absolute_url = models.URLField(blank=True, null=True,
            verbose_name="Post url")


    # add generic relation to pictures
    # add number of pictures

    ## managers
    objects = models.Manager()
    published = PublishedManager()

    class Meta:
        ordering = ['-pub_date']


    def prev_post_url(self):
        prev = Post.published.values('absolute_url').filter(
                pub_date__lt=self.pub_date)
        if prev:
            return prev[0]['absolute_url']


    def next_post_url(self):
        next = Post.published.values('absolute_url').filter(
                pub_date__gt=self.pub_date).order_by('pub_date')
        if next:
            return next[0]['absolute_url']


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
        slug = '{}/{}'.format(
                self.pub_date.strftime("%Y/%m/%d"),
                slugify(self.title)
            )
        unique_slugify(self, slug, slugify_value=False)

        self.abstract = format_abstract(self.source)
        self.content = format_content(self.source)

        super(Post, self).save()

    def __str__(self):
        return "%s" % self.title



class UsedManager(models.Manager):
    """Returns a queryset with all tags with n_posts > 0."""
    def get_queryset(self):
        return super(UsedManager, self).get_queryset().filter(
                n_posts__gt= 0).order_by('-n_entry')



class Tag(models.Model):
    """Table for posts' tags."""
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
#@receiver(m2m_changed, sender=Post.tags.through)
def update_tags_n_posts(**kwargs):
    """Update tag's number of posts after post save or delete."""
    for tag in Tag.objects.all():
        tag.set_n_posts()
