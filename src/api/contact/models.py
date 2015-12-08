from django.db import models

from user.models import User
from weblog.utils import format_content


class Description(models.Model):
    """Description for contact page."""
    title = models.CharField(max_length=254,
            verbose_name="Title")
    content = models.TextField(null=True,
            verbose_name="Description")
    source = models.TextField(null=True,
            verbose_name="Source")
    date_update = models.DateTimeField(auto_now=True,
            db_index=True,
            verbose_name="Last update date")
    author = models.ForeignKey(User, blank=True, null=True)

    class Meta:
        ordering = ['date_update']
        get_latest_by = "date_update"


    def save(self, *args, **kwargs):
        """convert source.md to content.html, then save as
        a new entry."""
        
        self.content = format_content(self.source)
        self.pk = None

        super(Description, self).save()


    def __str__(self):
        return "{} - contact description".format(self.date_update)




class Message(models.Model):
    """Received emails table."""
    name = models.CharField(max_length=254,
            verbose_name="Name")
    user = models.ForeignKey(User, null=True, blank=True)
    mail = models.EmailField(verbose_name="Mail")
    website = models.URLField(blank=True, null=True,
            verbose_name="Website")
    subject = models.CharField(max_length=254, verbose_name="Subject")
    message = models.TextField(verbose_name="Message")
    # True if user want to receive a copy of sent message
    forward = models.BooleanField(default=True,
            verbose_name="Forward")
    date = models.DateTimeField(auto_now=True,
            verbose_name="Send date")
    ip = models.GenericIPAddressField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """Add user data then save."""
        if self.user:
            if not self.name:
                self.name = self.user.username
            if not self.mail:
                self.mail = self.user.email
            if not self.website:
                self.website = self.user.website
        super(Message, self).save()

