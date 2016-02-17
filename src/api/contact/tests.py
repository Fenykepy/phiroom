from django.core import mail
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
        name=instance.staffUser.username,
        user=instance.staffUser,
        mail=instance.staffUser.email,
        website=instance.staffUser.website,
        subject="contact",
        message="Hello",
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
                author=self.staffUser
        )
        # assert description has been saved in db
        desc = Description.objects.get(pk=2)
        self.assertEqual(desc.title, "Contact")
        self.assertEqual(desc.author, self.staffUser)
        self.assertEqual(desc.source, 
                "My beautiful source \n##titre##")
        self.assertEqual(desc.content,
                "<p>My beautiful source </p>\n<h2>titre</h2>")
        self.assertTrue(desc.date_update)

        # assert updating description always save as a new one
        desc.title = "New contact"
        desc.author = self.normalUser
        desc.save()
        
        desc2 = Description.objects.get(pk=3)
        self.assertEqual(desc2.title, "New contact")
        self.assertEqual(desc2.author, self.normalUser)
       
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
            user=self.normalUser,
            forward=False
        )
        mesg.save()
        # assert it has been saved in db
        mesg = Message.objects.get(pk=2)
        self.assertEqual(mesg.name, self.normalUser.username)
        self.assertEqual(mesg.mail, self.normalUser.email)
        self.assertEqual(mesg.subject,  "A second subject")
        self.assertEqual(mesg.message, "A second message")
        self.assertEqual(mesg.forward, False)
        self.assertEqual(mesg.user, self.normalUser)
        self.assertTrue(mesg.date)



class DescriptionAPITest(APITestCase):
    """Description API Test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create few descriptions
        self.desc = Description.objects.create(
                title="Contact",
                source="My beautiful source \n##titre##",
                author=self.staffUser
        )
        self.desc2 = Description.objects.create(
                title="Contact2",
                source="My beautiful source \n##titre##",
                author=self.staffUser
        )
        self.desc3 = Description.objects.create(
                title="Contact3",
                source="My beautiful source \n##titre##",
                author=self.staffUser
        )


        self.client = APIClient()

    
    def test_latest_description(self):
        url = '/api/contact/description/'
        data = {
            'title': 'toto',
            'source': 'tata',
        }

        # test without login
        # client should get last description
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.desc3.title)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)
 
        # test with normal user
        login(self, self.normalUser)
        # client should get last description
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.desc3.title)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)       


        # test with staff member
        login(self, self.staffUser)
        # client should get last description
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.desc3.title)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)       



    def test_descriptions_list(self):
        url = '/api/contact/descriptions/'
        data = {
            'title': 'toto',
            'source': 'tata',
        }

        # test without login
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 401)
 
        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 403)       


        # test with staff member
        login(self, self.staffUser)
        # client should get list of descriptions
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 4)
        # client should be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        #self.assertEqual(len(response.data['results']), 4)
        desc = Description.objects.latest()
        self.assertEqual(desc.title, data['title'])
        self.assertEqual(desc.source, data['source'])
        self.assertTrue(desc.date_update)
        self.assertTrue(desc.content)
        # assert user is save as author
        self.assertEqual(desc.author, self.staffUser)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)       


 
    def test_descriptions_detail(self):
        url = '/api/contact/descriptions/{}/'.format(
                self.desc.pk)
        data = {
            'title': 'toto',
            'source': 'tata',
        }

        # test without login
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 401)
 
        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 403)       


        # test with staff member
        login(self, self.staffUser)
        # client should get list of descriptions
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.desc.title)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)       

       

class MessageAPITest(APITestCase):
    """Message API Test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create test messages
        create_test_messages(self)

        self.client = APIClient()

    def test_messages_list(self):
        url = '/api/contact/messages/'
        data = {
            'name': 'toto',
            'mail': 'toto@toto.com',
            'website': 'http://toto.com',
            'subject': 'test',
            'message': 'message',
            'forward': False
        }
        data2 = {
            'subject': 'test',
            'message': 'message',
            'forward': True
        }
        # test without login
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client should be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # !!! assert mail has been sent
        # one mail should have been sent (forward is false)
        self.assertEqual(len(mail.outbox), 1)
        self.assertTrue(mail.outbox[0].subject)
        self.assertTrue(mail.outbox[0].message)
        self.assertTrue(data['message'] in mail.outbox[0].body)
        self.assertTrue(data['subject'] in mail.outbox[0].body)
        self.assertTrue(self.staffUser.email in mail.outbox[0].to)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 401)
 
        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client should be able to post
        response=self.client.post(url, data2)
        self.assertEqual(response.status_code, 201)

        mesg = Message.objects.latest('pk')
        self.assertEqual(mesg.name, self.normalUser.username)
        self.assertEqual(mesg.mail, self.normalUser.email)
        self.assertEqual(mesg.website, self.normalUser.website)
        self.assertEqual(mesg.user, self.normalUser)
        # !!! assert mail has been sent
        # 2 mails should have been sent (forward is true)
        self.assertEqual(len(mail.outbox), 3)
        self.assertTrue(mail.outbox[1].subject)
        self.assertTrue(mail.outbox[1].message)
        self.assertTrue(data2['message'] in mail.outbox[1].body)
        self.assertTrue(data2['subject'] in mail.outbox[1].body)
        self.assertTrue(self.staffUser.email in mail.outbox[1].to)
        # assert user email is in recipient list
        self.assertTrue(self.normalUser.email in mail.outbox[2].to)
        # assert message in email body
        self.assertTrue(data2['message'] in mail.outbox[2].body)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 403)       


        # test with staff member
        login(self, self.staffUser)
        # client should get list of messages
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # assert messages have been saved
        self.assertEqual(len(response.data['results']), 4)
        self.assertEqual(response.data['results'][2]['name'], data['name'])
        self.assertEqual(response.data['results'][2]['mail'], data['mail'])
        self.assertEqual(response.data['results'][2]['subject'], data['subject'])
        self.assertEqual(response.data['results'][2]['message'], data['message'])
        self.assertEqual(response.data['results'][2]['website'], data['website'])
        self.assertEqual(response.data['results'][2]['forward'], data['forward'])
        # assert IP and date have been saved
        message = Message.objects.get(pk=4)
        self.assertTrue(message.date)
        self.assertTrue(message.ip)
        # client should be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # !!! assert mail has been sent
        # one mail should have been sent (forward is true)
        self.assertEqual(len(mail.outbox), 4)
        self.assertTrue(mail.outbox[3].subject)
        self.assertTrue(mail.outbox[3].message)
        self.assertTrue(data2['message'] in mail.outbox[3].body)
        self.assertTrue(data2['subject'] in mail.outbox[3].body)
        self.assertTrue(self.staffUser.email in mail.outbox[3].to)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 405)       


    def test_messages_detail(self):
        url = '/api/contact/messages/1/'
        data = {
            'name': 'toto',
            'mail': 'toto@toto.com',
            'website': 'http://toto.com',
            'subject': 'test',
            'message': 'message',
            'forward': False
        }

        # test without login
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 401)
 
        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get
        response=self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 403)       


        # test with staff member
        login(self, self.staffUser)
        # client should get specific message
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['subject'], self.mesg.subject)
        # client shouldn't be able to post
        response=self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response=self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response=self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client should be able to delete
        response=self.client.delete(url)
        self.assertEqual(response.status_code, 204)       
        # assert object has been deleted
        m = Message.objects.filter(pk=1).count()
        self.assertEqual(m, 0)



