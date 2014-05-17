from datetime import datetime

from django.db import models
from django.core.urlresolvers import reverse

from weblog.models import Entry, PublishedManager, NotDraftManager

class Article(Entry):
    """Article weblog entry"""
    objects = models.Manager()
    published = PublishedManager()
    not_draft = NotDraftManager()
    def get_absolute_url(self):
        return reverse('article_view', kwargs={'date': self.pub_date.strftime("%Y/%m/%d"), 'slug': self.slug})

    def save(self, **kwargs):
        """Set entry as article and save"""
        self.is_article = True
        super(Article, self).save()    
