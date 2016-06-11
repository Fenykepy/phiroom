from django.db import models

from user.models import User
from librairy.models import Picture
from portfolio.models import Portfolio
from weblog.models import Post


class Hits(models.Model):
    """
    Abstract table for visits entries.
    """
    ip = models.CharField(max_length=39, db_index=True)
    date = models.DateTimeField(auto_now_add=True, auto_now=False)
    user = models.ForeignKey(User, null=True, blank=True)
    staff = models.BooleanField(default=False, db_index=True)

    class Meta:
        abstract = True



class PortfolioHits(Hits):
    """
    Table for portfolio visits entries.
    """
    portfolio = models.ForeignKey(Portfolio)



class PostHits(Hits):
    """
    Table for weblog post's visits entries.
    """
    post = models.ForeignKey(Post)



class PictureHits(Hits):
    """
    Table for picture visits entries.
    """
    picture = models.ForeignKey(Picture)



class ContactHits(Hits):
    """
    Table for contact page visits entries.
    """
    pass

