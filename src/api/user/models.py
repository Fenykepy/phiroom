from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail

from phiroom.settings import DEFAULT_FROM_EMAIL



def has_changed(instance, field, manager="objects"):
    """Returns True if a field as changed in a model
    May be used in a model.save() method.
    """
    if not instance.pk:
        return True
    manager = getattr(instance.__class__, manager)
    old = getattr(manager.get(pk=instance.pk), field)
    return not getattr(instance, field) == old



class User(AbstractUser):
    """User extension table."""
    uuid = models.CharField(max_length=42, blank=True, null=True)
    uuid_expiration = models.DateTimeField(blank=True, null=True)
    avatar = models.ImageField(
            null=True,
            blank=True,
            upload_to='images/avatars',
            verbose_name="Avatar",
            help_text="A picture to download as avatar."
    )
    author_name = models.CharField(
            max_length=100,
            verbose_name="Author name",
            blank=True,
            null=True,
            help_text="Your name as shown under content you published"
    )
    website = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Website",
            help_text="A link to your website"
    )
    facebook_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Facebook",
            help_text="A link to your facebook page"
    )
    flickr_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Flickr",
            help_text="A link to your flickr page"
    )
    px500_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="500px",
            help_text="A link to your 500px page"
    )
    twitter_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Twitter",
            help_text="A link to your twitter page"
    )
    gplus_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Google +",
            help_text="A link to your google + page"
    )
    pinterest_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Pinterest",
            help_text="A link to your pinterest page"
    )
    vk_link = models.URLField(
            null=True,
            blank=True,
            max_length=2000,
            verbose_name="Vkontakte",
            help_text="A link to your vkontakte page"
    )
    mail_newsletter = models.BooleanField(
            default=False,
            verbose_name="Suscribe to news letter",
            help_text="To receive a mail at each new publication."
    )
    mail_contact = models.BooleanField(
            default=False,
            db_index=True,
            verbose_name="Receive contact emails",
            help_text=(
                "To receive mails sent from contact page."
                "(for staff members only)"
            )
    )
    mail_registration = models.BooleanField(
            default=False,
            db_index=True,
            verbose_name="Receive registration's emails",
            help_text=(
                "To receive a mail at each new registration."
                "(for staff members only)"
            )
    )


    def get_short_name(self):
        """returns first_name if any or user name."""
        if self.first_name:
            return self.first_name
        return self.username


    def get_full_name(self):
        """returns first_name + last_name or short_name method."""
        if self.first_name and self.last_name:
            return '{} {}'.format(self.first_name, self.last_name)
        return self.get_short_name()


    def send_mail(self, subject, message):
        """Send a mail to user."""
        return send_mail(
                subject,
                message,
                DEFAULT_FROM_EMAIL,
                [self.email],
        )


    def save(self, **kwargs):
        """Resize avatar if necessary, suscribe to mail if
        it's a creation and user is staff, then save."""

        if not self.pk and self.is_staff:
            self.mail_contact = True
            self.mail_registration = True
        if not self.author_name and self.is_staff:
            self.author_name = self.get_full_name()

        super(User, self).save()
    
    
    def __str__(self):
        return "{}".format(self.username)



def sendContactMail(subject, message):
    """Send a mail to all users who suscribed to contact
    emails.
    """
    contact_users = User.objects.filter(mail_contact=True)
    if not contact_users:
        # no mail to send
        return
    # get all addresses in a list
    contact_users_mails = [
        contact_user.email for contact_user in contact_users
    ]
    # send mail to contact users
    send_mail(subject, message, DEFAULT_FROM_EMAIL, contact_users_mails)


