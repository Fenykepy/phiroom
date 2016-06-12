from django.db import models

from user.models import User
from librairy.models import Picture
from portfolio.models import Portfolio
from weblog.models import Post


class Hit(models.Model):
    """
    Abstract table for visits entries.
    """
    ip = models.CharField(max_length=39, db_index=True)
    date = models.DateTimeField(auto_now_add=True, auto_now=False)
    user = models.ForeignKey(User, null=True, blank=True)

    class Meta:
        abstract = True



class PortfolioHit(Hit):
    """
    Table for portfolio visits entries.
    """
    portfolio = models.ForeignKey(Portfolio)



class PostHit(Hit):
    """
    Table for weblog post's visits entries.
    """
    post = models.ForeignKey(Post)



class PictureHit(Hit):
    """
    Table for picture visits entries.
    """
    picture = models.ForeignKey(Picture)



class ContactHit(Hit):
    """
    Table for contact page visits entries.
    """
    pass

