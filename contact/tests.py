from django.test import TestCase, Client
from django.core import mail

from user.models import User
from contact.models import Description, Message

## What to test

## Description
# Check that source is properly transposed to html
# Check that user is properly given as author
# Check that contact url return good template

## Message
# Check that if bottrap field exists post is rejected
# Check that authenticated user receive good form
# Check that un_authenticated user receive good form
# Check that authenticated user fieds are well completed
    # (user, username, mail, website)
# Check that a mail is send to user if forward field is true
# Check that no mail is send to user if forward field is false
# Check that a mail si send to contact members or to staff members if no contacts ones

class ContactTest(TestCase):
    """Contact url tests."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='jacob', email='jacob@toto.com', password='top_secret')
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.mail_contact =True
        self.user.save()
        self.client = Client()


    def test_urls(self):
        """Test urls and their templates."""
        urls = [
                {
                    'url': '/contact/',
                    'status': 200,
                    'template': 'contact/contact_view.html',
                },
                {
                    'url': '/contact/edit/',
                    # should redirect to login page as user is not staff
                    'status': 302,
                    'template': 'weblog/weblog_forms.html',
                },
                {
                    'url': '/contact/sent/',
                    'status': 200,
                    'template': 'contact/contact_sent.html',
                },
        ]

        for elem in urls:
            response = self.client.get(elem['url'])
            self.assertEqual(response.status_code, elem['status'])
            response = self.client.get(elem['url'], follow=True)
            self.assertEqual(response.templates[0].name, elem['template'])


    def test_contact_page(self):
        """Assert that a normal client get contact description and form."""
        # Tartempion goes to contact page
        response = self.client.get('/contact/')
        # Tartempion sees default title and content
        self.assertEqual('Description de la page de contact', response.context['entry']['content'])
        self.assertEqual('Page de Contact', response.context['entry']['title'])


    def test_send_message(self):
        """Assert that a normal client can send a message."""
        # Tartempion posts a message
        response = self.client.post('/contact/', {
            'name': 'Tartempion',
            'mail': 'tartempion@tartempion.fr',
            'website': 'http://tartempion.fr',
            'subject': 'Test message',
            'message': 'Body of test message',
            'forward': 'on',
            }, follow=True
        )

        # assert here that mails have been save in db
        messages = Message.objects.all().count()
        self.assertEqual(messages, 1)
        
        # assert that mails have been sent
        self.assertEqual(len(mail.outbox), 2)
        mails = (mail.outbox[0].to, mail.outbox[1].to)
        self.assertEqual(mails, (['tartempion@tartempion.fr'], ['jacob@toto.com']))

        # empty mailbox
        mail.outbox = []

        # Tartempion has been redirected to '/contact/sent/' page
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.templates[0].name, 'contact/contact_sent.html')



    def test_update_description(self):
        """test description update"""
        pass
        # HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        # mock superuser
        #mock_request = mock.Mock()
        #mock_request.user = mock.Mock()
        #mock_request.user.is_staff = True

        #response = self.client.post('/contact/edit/', {
        #    'title': 'Une page contact de test',
        #    'source': 'le source du contenu de la page contact',
        #    }, follow=True
        #)
        #self.assertEqual(response.templates[0].name,
        #        'weblog/weblog_forms.html'
        #        ) # check if redirection is ok
        
        #contact_num = Description.objects.all().count()
        #self.assertEqual(contact_num, 2) # check if new content was created

        #contact = Description.objects.latest()
        #self.assertEqual(contact.title, 'Une page contact de test')
