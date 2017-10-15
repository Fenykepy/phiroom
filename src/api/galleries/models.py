from django.db import models
from librairy.models import Picture
from user.models import User
from django.utils import timezone
from weblog.slug import unique_slugify

from django.core.cache import cache

from django.db.models.signals import post_save
from django.dispatch import receiver




class PublishedManager(models.Manager):
    """
    Returns a query set with all published galleries.
    """
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(
                pub_date__lte=timezone.now(),
                draft=False)


class Gallery(models.Model):
    """
    Table for galleries.
    """
    title = models.CharField(max_length=254, verbose_name="Title")
    slug = models.CharField(max_length=270, db_index=True, unique=True)
    pictures = models.ManyToManyField(Picture, blank=True,
            through='GalleryPicture',
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
    folder = models.ForeignKey('Folder', null=True, blank=True)
    order = models.IntegerField(default=0)

    ## managers
    objects = models.Manager()
    published = PublishedManager()

    class Meta:
        ordering = ['order', '-pub_date']


    def get_pictures(self):
        """
        Returns all related pictures ordered by "GalleryPicture.order"
        """
        return GalleryPicture.objects.filter(gallery=self)

   

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

        super(Gallery, self).save()



    def __str__(self):
        return "{} - {}".format(self.pk, self.title)




class GalleryPicture(models.Model):
    """
    Through table for gallery - pictures relation,
    add an order column.
    """
    gallery = models.ForeignKey(Gallery)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ("gallery", "picture")



class Folder(models.Model):
    """
    Table for galleries folders.
    """
    name = models.CharField(max_length=254, verbose_name="Name")
    slug = models.CharField(max_length=270, db_index=True, unique=True)

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        """Set slug from name then save."""
        unique_slugify(self, slugify(self.name), slugify_value=False)

        super(Folder, self).save()



class Menu(models.Model):
    """
    Table to order top level galleries and folders.
    """
    gallery = models.ForeignKey(Gallery)
    folder = models.ForeignKey(Folder)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']




@receiver(post_save, sender=Gallery)
@receiver(post_save, sender=GalleryPicture)
@receiver(post_save, sender=Folder)
@receiver(post_save, sender=Menu)
def clear_cache(sender, **kwargs):
    cache.clear()





    
