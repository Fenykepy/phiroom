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
            username='jacob',
            email='jacob@toto.com',
            password='top_secret'
        )
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.mail_contact =True
        self.user.save()

        self.user2 = User.objects.create_user(
            username='tartempion',
            email='tartempion@tartempion.fr',
            password='toto'
        )

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
        self.assertEqual('Description de la page de contact',
                response.context['entry']['content'])
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
        
        # assert that mails have been sent (two because forward is true)
        self.assertEqual(len(mail.outbox), 2)
        mails = (mail.outbox[0].to, mail.outbox[1].to)
        self.assertEqual(mails, (['tartempion@tartempion.fr'],
            ['jacob@toto.com']))

        # empty mailbox
        mail.outbox = []

        # Tartempion has been redirected to '/contact/sent/' page
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'contact/contact_sent.html')


    def test_send_spam(self):
        """Assert that a spam bot can't send a message."""
        # Spammer bot posts a message
        response = self.client.post('/contact/', {
            'name': 'spammer bot',
            'mail': 'spammer@bot.fr',
            'website': 'http://spamfiesta.com',
            'subject': 'This mail is spam',
            'message': 'Body',
            'forward': 'on',
            'bottrap': 'I\'m a stupid bot',
            }, follow=True
        )

        # assert here that mail hasn't been send in db
        messages = Message.objects.all().count()
        self.assertEqual(messages, 0)

        # assert that mails hasn't been sent
        self.assertEqual(len(mail.outbox), 0)
        mail.outbox = []

        # Spammer has been redirected to '/contact/' page
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'contact/contact_view.html')

    
    def test_send_authenticated(self):
        """Assert that an authenticated user has less fields."""
        # connect tartempion
        login = self.client.login(username='tartempion', password='toto')
        self.assertEqual(login, True)

        # post a message
        response = self.client.post('/contact/', {
            'subject': 'This mail is from authenticated user',
            'message': 'Body',
            }, follow=True
        )

        # assert mail has been stored in db
        messages = Message.objects.all().count()
        self.assertEqual(messages, 1)

        # assert that mail has been sent (only one, because forward is false)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['jacob@toto.com'])
        mail.outbox = []

        # tartempion has been redirected to '/contact/sent/' page
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'contact/contact_sent.html')


    def test_update_description(self):
        """test description update"""
        # login with jacob staff user
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)
        
        # send form with 'contact_save' submit
        response = self.client.post('/contact/edit/', {
            'title': 'Une page contact de test',
            'source': 'le source du contenu de la page contact',
            'contact_save': 'on',
            }, follow=True
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'contact/contact_view.html'
                ) # check if redirection is ok
        
        # assert description has been save in db
        contact_num = Description.objects.all().count()
        self.assertEqual(contact_num, 2) # check if new content was created
        
        # assert last description is the new one
        contact = Description.objects.latest()
        self.assertEqual(contact.title, 'Une page contact de test')
        self.assertEqual(contact.content,
                '<p>le source du contenu de la page contact</p>'
            )


    def test_update_description_preview(self):
        """test description update"""
        # login with jacob staff user
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)
        
        # send form with 'contact_preview' submit
        response = self.client.post('/contact/edit/', {
            'title': 'Une page contact de test',
            'source': 'le source du contenu de la page contact',
            'contact_preview': 'on',
            }, follow=True
        )
        
        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html'
                ) # check if redirection is ok
        
        # assert preview is correct
        self.assertEqual(response.context['contact_preview'].title,
                'Une page contact de test')
        self.assertEqual(response.context['contact_preview'].content,
                '<p>le source du contenu de la page contact</p>'
            )

        





