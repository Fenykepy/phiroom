from pprint import pprint

from django.test import TestCase, Client

from conf.models import Conf, Page
from user.models import User

class PhiroomTest(TestCase):
    """Phiroom tests."""

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

        self.client = Client()


    def test_urls(self):
        """tests urls and their templates."""
        # test default home page
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'home.html')

        # test custom home page 
        page = Page.objects.get(name='portfolios')
        conf = Conf.objects.latest()
        conf.home_page = page
        conf.save()

        response = self.client.get('/')
        self.assertEqual(response.status_code, 302)
        response = self.client.get('/', follow=True)
        self.assertEqual(response.templates[0].name,
                'portfolios/portfolio_list.html')

        # test feeds
        response = self.client.get('/feed/')
        self.assertEqual(response.status_code, 200)

        # test sitemap
        response = self.client.get('/sitemap.xml')
        self.assertEqual(response.status_code, 200)


    def test_home_page_menu(self):
        """test home page menu."""
        response = self.client.get('/')
        # test with normal user
        self.assertEqual(response.context['menu'][0]['name'], 'home')
        self.assertEqual(response.context['menu'][1]['name'], 'portfolios')
        self.assertEqual(response.context['menu'][2]['name'], 'weblog')
        self.assertEqual(response.context['menu'][3]['name'], 'contact')
        self.assertEqual(len(response.context['menu']), 4)

        # !!! test display of librairy link with staff members.
