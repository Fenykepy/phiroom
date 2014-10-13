from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

from user.models import User

class NotDeletedManager(models.Manager):
    """Returns a queryset with all not deleted comments."""
    def get_queryset(self):
        return super(NotDeletedManager, self).get_queryset().filter(
                is_deleted=False,
                ).order_by('date')

class Comment(models.Model):
    """Table for comments."""
    name = models.CharField(max_length=254, verbose_name="Nom")
    user = models.ForeignKey(User, null=True, blank=True)
    mail = models.EmailField(
            verbose_name="Courriel (ne sera ni affiché, ni transmit)")
    website = models.URLField(verbose_name="Site web", blank=True, null=True)
    message = models.TextField(verbose_name="Message")
    date = models.DateTimeField(auto_now_add=True, auto_now=True,
            verbose_name="Date d'envoi")
    ip = models.GenericIPAddressField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False,
            verbose_name="Le commentaire a été supprimé.")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey(
            'content_type',
            'object_id')

    # managers
    objects = models.Manager()
    not_deleted = NotDeletedManager()

