from django.db import models
from librairy.models import Picture
from django.utils import timezone
from django.template.defaultfilters import slugify
from user.models import User
from weblog.slug import unique_slugify

from django.core.cache import cache

from django.db.models.signals import post_save
from django.dispatch import receiver



class PublishedManager(models.Manager):
    """
    Returns a query set with all published portfolios.
    """
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(
                pub_date__lte=timezone.now(),
                draft=False)



class Portfolio(models.Model):
    """
    Table for portfolios entries.
    """
    title = models.CharField(max_length=254, verbose_name="Title")
    slug = models.CharField(max_length=270, db_index=True, unique=True)
    pictures = models.ManyToManyField(Picture, blank=True,
            through='PortfolioPicture',
            verbose_name="Pictures")
    author = models.ForeignKey(User)
    draft = models.BooleanField(default=False, db_index=True,
            verbose_name="Draft")
    create_date = models.DateTimeField(auto_now_add=True,
            verbose_name="Creation date")
    update_date = models.DateTimeField(auto_now=True,
            verbose_name="Last modification date")
    pub_date = models.DateTimeField(blank=True, db_index=True,
            verbose_name="Publication date")
    order = models.IntegerField(default=0)

    ## managers
    objects = models.Manager()
    published = PublishedManager()

    class Meta:
        ordering = ['order', '-pub_date']


    def get_pictures(self):
        """
        Returns all related pictures ordered by "PortfolioPicture.order"
        """
        return PortfolioPicture.objects.filter(portfolio=self)

   

    def save(self, **kwargs):
        """
        Set pub_date if created and no one,
        make unique slug from title,
        set author then save.
        """
        # if create and pubdate hasn't been set by user
        if not self.pub_date:
            self.pub_date = timezone.now()
        # format slug
        unique_slugify(self, slugify(self.title), slugify_value=False)

        super(Portfolio, self).save()



    def __str__(self):
        return "{} - {}".format(self.pk, self.title)


@receiver(post_save, sender=Portfolio)
def clear_cache(sender, **kwargs):
    cache.clear()

class PortfolioPicture(models.Model):
    """
    Through table for portfolio - pictures relation,
    add an order column.
    """
    portfolio = models.ForeignKey(Portfolio)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ("portfolio", "picture")




@receiver(post_save, sender=PortfolioPicture)
def clear_cache(sender, **kwargs):
    cache.clear()



