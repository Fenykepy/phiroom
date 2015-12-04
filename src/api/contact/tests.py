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
        desc = Description.objects.create(
                title="Contact",
                source="My beautiful source \n##titre##",
                author=self.user
        )
        # assert description has been saved in db
        desc = Description.objects.get(pk=1)
        self.assertEqual(desc.title, "Contact")
        self.assertEqual(desc.author, self.user)
        self.assertEqual(desc.source, 
                "My beautiful source \n##titre##")
        self.assertEqual(desc.content,
                "<p>My beautiful source </p>\n<h2>titre</h2>")
        self.assertTrue(desc.date_update)

        # assert updating description always save as a new one
        desc.title = "New contact"
        desc.author = self.user2
        desc.save()
        
        desc2 = Description.objects.get(pk=2)
        self.assertEqual(desc2.title, "New contact")
        self.assertEqual(desc2.author, self.user2)
       
        # assert latest always returns latest description
        latest = Description.objects.latest()
        self.assertEqual(desc2, latest)


class MessageModelTest(TestCase):
    """Message model test class."""

    def setUp(self):
        # create users
        create_test_users(self)

    def test_message_creation(self):
        # create a new message
        mesg = Message(
            name="Tom",
            mail="tom@tom.com",
            subject="My subject",
            message="My message",
            forward=True
        )
        mesg.save()
        # assert it has been saved in db
        mesg = Message.objects.get(pk=1)
        self.assertEqual(mesg.name, "Tom")
        self.assertEqual(mesg.mail, "tom@tom.com")
        self.assertEqual(mesg.subject, "My subject")
        self.assertEqual(mesg.message, "My message")
        self.assertTrue(mesg.forward)
        self.assertTrue(mesg.date)

        # create a test message with existing user
        mesg = Message(
            subject="A second subject",
            message="A second message",
            user=self.user2,
            forward=False
        )
        mesg.save()
        # assert it has been saved in db
        mesg = Message.objects.get(pk=2)
        self.assertEqual(mesg.name, self.user2.username)
        self.assertEqual(mesg.mail, self.user2.email)
        self.assertEqual(mesg.subject,  "A second subject")
        self.assertEqual(mesg.message, "A second message")
        self.assertEqual(mesg.forward, False)
        self.assertEqual(mesg.user, self.user2)
        self.assertTrue(mesg.date)


