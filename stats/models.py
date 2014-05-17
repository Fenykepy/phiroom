from django.db import models
from user.models import User
from weblog.models import Entry

class Page(models.Model):
    url = models.URLField()
    n_view = models.IntegerField(default=0)
    n_view_not_staff = models.IntegerField(default=0)
    entry = models.ForeignKey(Entry, blank=True, null=True)
    
    def __str__(self):
        return "{0}, vu {1} fois".format(self.url, self.n_view_not_staff)

class View(models.Model):
    page = models.ForeignKey(Page)
    ip = models.GenericIPAddressField()
    user = models.ForeignKey(User, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        return "%s" % self.page


