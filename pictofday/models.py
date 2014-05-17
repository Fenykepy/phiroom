from datetime import datetime

from django.db import models
from django.core.urlresolvers import reverse

from weblog.models import Entry, PublishedManager, NotDraftManager
from librairy.models import Picture

class Pictofday(Entry):
    """Pictofday weblog entry"""
    objects = models.Manager()
    published = PublishedManager()
    not_draft = NotDraftManager()
    picture = models.OneToOneField(Picture,  unique=True, verbose_name="Image", null=True, blank=True)
    day_date = models.DateField(unique=True, verbose_name="Date de l'image du jour", blank=True)

    def get_absolute_url(self):
        return reverse('pictofday_view', kwargs={'date': self.day_date.strftime("%Y/%m/%d")})

    def save(self, **kwargs):
        """Set entry as pictofday and save"""
        self.is_pictofday = True
        super(Pictofday, self).save()

    def __str__(self):
        return "%s" % self.day_date.strftime("%d-%m-%Y")
    

