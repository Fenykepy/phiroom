from django.db import models

from user.models import User
from librairy.models import Picture
from portfolio.models import Portfolio
from weblog.models import Post


class Hit(models.Model):
    """
    Table for visits entries.
    """
    TYPES = (
        ('PICT', 'Picture'),
        ('PORT', 'Portfolio'),
        ('POST', 'Weblog post'),
        ('CONTACT', 'Contact'),
    )
    # remote adress get from django request,
    # correspond to node server IP when server side rendering was used
    request_ip = models.CharField(max_length=39)
    # correspond to client posted IP or IP from django request
    ip = models.CharField(max_length=39, db_index=True, null=True)
    date = models.DateTimeField(auto_now_add=True, auto_now=False)
    user = models.ForeignKey(User, null=True, blank=True, db_index=True)
    type = models.CharField(max_length=40, db_index=True, choices=TYPES)
    # we need charfield here because pictures use sha1 as pk and not an integer
    # we don't use FK to keep hit even if original entrie has been deleted
    related_key = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        ordering = ['-date']


    def save(self, **kwargs):
        """
        Set ip with request_ip if it's blank then save.
        """
        if not self.ip:
            self.ip = self.request_ip
        
        super(Hit, self).save()

