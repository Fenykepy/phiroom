from django.test import TestCase

from rest_framework.test import APIClient, APITestCase

from contact.models import Description, Message
from user.models import User

from user.tests import create_test_users, login


def create_test_messages(instance):
    """Create messages for tests.
    Run create_test_users first.
    """
    instance.mesg = Message.objects.create(
        name=instance.user.username,
        user=instance.user,
        mail=instance.user.mail,
        website=instance.user.website,
        subject="contact",
        message="Hello",
        forward=True
    )
    
    instance.mesg2 = Message.objects.create(
        name="Bill",
        mail="Bill@bill.com",
        subject="contact",
        message="Hello",
        forward=False
    )

class DescriptionModelTest(TestCase):
    """Description model test class."""

    def setUp(self):
        # create users
        create_test_users(self)


    def test_description_creation(self):
        # create a description

