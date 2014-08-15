from django.db import models

from user.models import User

class Description(models.Model):
    """Description for contact page"""
    title = models.CharField(max_length=254, verbose_name="Titre")
    content = models.TextField(null=True, verbose_name="Description")
    source = models.TextField(null=True, verbose_name="Source")
    date_update = models.DateTimeField(auto_now_add=True, auto_now=True, verbose_name="Date de modification")
    author = models.ForeignKey(User, blank=True, null=True)

class Message(models.Model):
    """Received emails table"""
    name = models.CharField(max_length=254, verbose_name="Nom")
    user = models.ForeignKey(User, null=True, blank=True)
    mail = models.EmailField(verbose_name="Courriel (ne sera ni affiché, ni transmit)")
    website = models.URLField(verbose_name="Site web", blank=True, null=True)
    subject = models.CharField(max_length=254, verbose_name="Objet")
    message = models.TextField(verbose_name="Message")
    forward = models.BooleanField(default=True, verbose_name="Renvoi (si vous souhaitez en recevoir une copie en retour)")
    date = models.DateTimeField(auto_now_add=True, auto_now=True, verbose_name="Date d'envoi")
    ip = models.GenericIPAddressField(null=True, blank=True)
    unread = models.BooleanField(default=True)



