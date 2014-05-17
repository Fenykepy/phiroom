#-*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """users extention table"""
    # voir pour la locale
        # voir pour la langue
    # voir pour un système gravatar
    avatar = models.ImageField(null=True, blank=True, upload_to="images/avatars/", verbose_name="Avatar",
            help_text="Une image à télécharger comme avatar.")
    author_name = models.CharField(max_length=100, verbose_name="Nom d'auteur", blank=True, null=True,
            help_text="Votre nom tel qu'il apparaît sous le contenu que vous publiez.")
    signature = models.CharField(max_length=100, verbose_name="Signature", blank=True, null=True,
            help_text="Un court texte qui apparaît sous vos commentaires.")
    web_site = models.URLField(null=True, blank=True, verbose_name="Site web",
            help_text="Un lien vers votre site web.")
    weblog_mail_newsletter = models.BooleanField(default=False, verbose_name="S'inscrire à la news letter",
            help_text="Pour recevoir un mail à chaque nouvelle publication.")
    
    def __str__(self):
        return "Profil de {0}".format(self.username)
