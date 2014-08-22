import mock

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from pprint import pprint

from django.test import TestCase, Client, LiveServerTestCase
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

class ContactTest(LiveServerTestCase):
    """Contact url tests"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='jacob', email='jacob@toto.com', password='top_secret')
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.mail_contact =True
        self.user.save()
        self.client = Client()
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)


    def tearDown(self):
        self.browser.quit()
        

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
                    'status': 302, # should redirect as user is not staff
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
        # Gertrude opens her web browser, and goes to the contact page
        self.browser.get(self.live_server_url + '/contact/')
        # She sees the default contact page title and content
        body = self.browser.find_element_by_tag_name('body')
        self.assertIn('Description de la page de contact', body.text)
        self.assertIn('Page de Contact', body.text)
        # She sees the form to leave a message and fullfill it
        name_field = self.browser.find_element_by_name('name')
        name_field.send_keys('Gertrude')
        mail_field = self.browser.find_element_by_name('mail')
        mail_field.send_keys('Gertrude@jocelyn.fr')
        website_field = self.browser.find_element_by_name('website')
        website_field.send_keys('http://gertrude-jocelyn.fr')
        subject_field = self.browser.find_element_by_name('subject')
        subject_field.send_keys('Message de test')
        message_field = self.browser.find_element_by_name('message')
        message_field.send_keys('Corps du message de test ' +
                'envoyé par gertrude')
        # she submit the form
        message_field.submit()

        # assert here that mails have been save in db
        messages = Message.objects.all().count()
        self.assertEqual(messages, 1)
        
        # assert that mails have been sent
        mails = (mail.outbox[0].to, mail.outbox[1].to)
        self.assertEqual(mails, (['Gertrude@jocelyn.fr'], ['jacob@toto.com']))
        self.assertEqual(len(mail.outbox), 2)

        # empty mailbox
        mail.outbox = []

        # she is redirected to '/contact/sent/' page
        body = self.browser.find_element_by_tag_name('body')
        self.assertIn('Votre message a bien été envoyé !', body.text)



    def test_update_description(self):
        """test description update"""
        pass

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
