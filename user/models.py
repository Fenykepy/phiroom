#-*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail

from phiroom.settings import DEFAULT_FROM_EMAIL

class User(AbstractUser):
    """users extention table"""
    # voir pour la locale
        # voir pour la langue
    # voir pour un système gravatar
    avatar = models.ImageField(
            null=True, blank=True,
            upload_to="images/avatars/", 
            verbose_name="Avatar",
            help_text="Une image à télécharger comme avatar."
        )
    author_name = models.CharField(
            max_length=100,
            verbose_name="Nom d'auteur",
            blank=True,
            null=True,
            help_text="Votre nom tel qu'il apparaît sous le contenu " + 
            "que vous publiez."
        )
    signature = models.CharField(
            max_length=100,
            verbose_name="Signature",
            blank=True,
            null=True,
            help_text="Un court texte qui apparaît sous vos commentaires."
        )
    web_site = models.URLField(
            null=True,
            blank=True,
            verbose_name="Site web",
            help_text="Un lien vers votre site web."
        )
    weblog_mail_newsletter = models.BooleanField(
            default=False,
            verbose_name="S'inscrire à la news letter",
            help_text="Pour recevoir un mail à chaque nouvelle publication."
        )
    mail_contact = models.BooleanField(
            default=False,
            verbose_name="Reçevoir les mail de contact",
            help_text="Pour recevoir les mails envoyés via la page de contact."
        )
    mail_comment = models.BooleanField(
            default=False,
            verbose_name="Reçevoir les mails de commentaires",
            help_text="Pour recevoir un mail à chaque nouveau commentaire."
        )
    mail_registration = models.BooleanField(
            default=False,
            verbose_name="Reçevoir les mails des inscriptions",
            help_text="Pour recevoir un mail à chaque nouvelle inscription."
        )


    def send_mail(self, subject, message):
        """send a mail to user"""
        return send_mail(
                subject,
                message,
                DEFAULT_FROM_EMAIL,
                [self.email]
            )
    

    def save(self, **kwargs):
        """If it's user creation, and user is staff member,
        pass mail_registration, mail_comment and mail_contact
        to true.
        """
        if not self.pk and self.is_staff:
            self.mail_contact = True
            self.mail_comment = True
            self.mail_registration = True

        super(User, self).save()
    

    def __str__(self):
        return "Profil de {0}".format(self.username)





def mail_superusers(subject, message):
    """Send a mail to all super users."""
    # get superusers
    superusers = User.objects.filter(is_superuser=True)
    # get superusers' mails in a list
    superusers_mails = [superuser.email for superuser in superusers]
    # send mail to superusers
    send_mail(subject, message, DEFAULT_FROM_EMAIL, superusers_mails)



def mail_staffmembers(subject, message):
    """Send a mail to all staff members."""
    # get staff members
    staffmembers = User.objects.filter(is_staff=True)
    # if no staff member, send mail to super user
    if not staffmembers:
        print('No staff members found, send mail to superusers.')
        return mail_superusers(subject, message)

    # get staff members' mails in a list
    staffmembers_mails = [staffmember.email for staffmember in staffmembers]
    # send mail to staff members
    send_mail(subject, message, DEFAULT_FROM_EMAIL, staffmembers_mails)



def mail_contactmembers(subject, message):
    """Send a mail to all users who receive
    contact's page messages."""
    # get contact members
    contactmembers = User.objects.filter(mail_contact=True)
    # if no contact member, send mail to staff members
    if not contactmembers:
        print('No contact members found, send mail to staff members.')
        return mail_staffmembers(subject, message)

    # get contact members' mails in a list
    contactmembers_mails = [
            contactmember.email for contactmember in contactmembers
        ]
    # send mail to contact members
    send_mail(subject, message, DEFAULT_FROM_EMAIL, contactmembers_mails)



def mail_registrationmembers(subject, message):
    """Send a mail to all users who receive
    registrations messages."""
    # get registration members
    registrationmembers = User.objects.filter(mail_registration=True)
    # if no registration member, send mail to staff members
    if not registrationmembers:
        print('No registration members found, send mail to staff members.')
        return mail_staffmembers(subject, message)

    # get registration members' mails in a list
    registrationmembers_mails = [
        registrationmember.email for registrationmember in registrationmembers
        ]
    # send mail to registration members
    send_mail(subject, message, DEFAULT_FROM_EMAIL, registrationmembers_mails)



def mail_commentmembers(subject, message):
    """Send a mail to all users who receive
    a mail for each comment."""
    # get comment members
    commentmembers = User.objects.filter(mail_comment=True)
    # if no comment member, send mail to staff members
    if not commentmembers:
        print('No comment members found, send mail to contact members.')
        return mail_contactmembers(subject, message)

    # get comment members' mails in a list
    commentmembers_mails = [
            commentmember.email for commentmember in commentmembers
        ]
    # send mail to comment members
    send_mail(subject, message, DEFAULT_FROM_EMAIL, commentmembers_mails)



def mail_newsletter(subject, message):
    """Send a mail to all users who suscribed to newsletter."""
    # get newsletter members
    newsmembers = User.objects.filter(weblog_mail_newsletter=True)
    # if no newsletter membres abort
    if not newsmembers:
        return
    
    # get newsletter members' mails in a list
    newsmembers_mails = [newsmember.email for newsmember in newsmembers]
    # send mail to newsletter members
    send_mail(subject, message, DEFAULT_FROM_EMAIL, newsmembers_mails)






