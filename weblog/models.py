from django.db import models
from django.core.urlresolvers import reverse

from user.models import User


class Post(models.Model):
    """
    Table for weblog posts entrys.
    """
    title = models.CharField(max_length=254, verbose_name="Title")
    slug = models.SlugField(max_length=254, db_index=True)
    description = models.TextField(null=True, blank=True,
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
    tags = models.ManyToManyField('Tag', verbose_name="Tags")
    author = models.ForeignKey(User)
    draft = models.BooleanField(default=False, db_index=True,
        verbose_name="Draft")
    create_date = models.DateTimeField(auto_now_add=True,
        auto_now=False, verbose_name="First redaction date")
    update_date = models.DateTimeField(auto_now_add=True,
        auto_now=True, verbose_name="Last modification date")
    pub_date = models.DateTimeField(blank=True, db_index=True,
        verbose_name="Publication date")

    # add generic relation to pictures
    # add number of pictures

    class Meta:
        ordering = ['-pub_update']

    def get_absolute_url(self):
        return reverse('post_detail', kwargs={
            'date': self.pub_date.strftime("%Y/%m/%d"),
            'slug': self.slug})

    def save(self, **kwargs):
        """Make unique slug from title, than save."""
        slug = '{}'.format(self.title)
        #queryset = Post.objects.filter(pub_date=
