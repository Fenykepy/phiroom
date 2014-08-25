from django.test import TestCase, Client

from user.models import User
from conf.models import Conf, Page


class ConfTest(TestCase):
    """Configuration tests."""

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
        self.user2.web_site = 'mysite@tartempion.fr'
        self.user2.save()

        self.client = Client()


    def test_fixtures(self):
        """Test that fixtures are correctly set up."""
        # get home page
        home = Page.objects.get(name='home')
        # get last configuration
        conf = Conf.objects.latest()
        # check configuration
        self.assertEqual(conf.title, 'Phiroom')
        self.assertEqual(conf.title_home, 'Phiroom')
        self.assertEqual(conf.sub_title_home,
                'le cms des photographes')
        self.assertEqual(conf.domain, 'phiroom.org')
        self.assertEqual(conf.home_page, home)
        self.assertEqual(conf.comment,
                'Paramètres par défaut')
        # check date is set up (else bug getting last conf
        date = False
        if conf.date:
            date = True
        self.assertEqual(date, True)


    def test_urls(self):
        """Conf url tests."""
        response = self.client.get('/settings/',)
        # should redirect as user is not staff
        self.assertEqual(response.status_code, 302)
        response = self.client.get(
                '/settings/',
                HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                follow=True
        )
        self.assertEqual(response.templates[0].name,
                'user/user_login.html')

        # should redirect as simple user
        login = self.client.login(username='tartempion', password='toto')
        self.assertEqual(login, True)
        response = self.client.get('/settings/',)
        # should redirect as user is not staff
        self.assertEqual(response.status_code, 302)
        response = self.client.get(
                '/settings/',
                HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                follow=True
        )
        self.assertEqual(response.templates[0].name,
                'user/user_login.html')

        # should get page as user is staff member 
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)
        response = self.client.get('/settings/',)
        # should not redirect as user is staff
        self.assertEqual(response.status_code, 200)
        response = self.client.get(
                '/settings/',
                HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                follow=True
        )
        self.assertEqual(response.templates[0].name,
                'settings/settings_form.html')

    def test_update_conf(self):
        """Conf update tests."""
        # login as staff
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)
        # post new conf
        response = self.client.post('/settings/', {
            'domain': 'phiroom.org',
            'title': 'Lavilotte-rolle',
            'title_home': 'Lavilotte-rolle Frédéric',
            'sub_title_home': 'Photographie, nature et poésie',
            'home_page': '1',
            'mail_profil': 'on',
            'mail_registration': 'on',
            'n_entrys_per_page': '5',
            'large_previews_size': '1024',
            'feed_title': 'phiroom',
            'feed_description': 'phiroom feed',
            'feed_number': '50',
            'n_last_entrys_menu': '10',
            'n_last_portfolios_menu': '2000',
            'comment': 'Nouveaux paramètres',
            }, follow=True
        )

        # assert new conf has been save in db
        confs = Conf.objects.all().count()
        self.assertEqual(confs, 2)

        # assert that new conf is default one
        conf = Conf.objects.latest()
        self.assertEqual(conf.comment, 'Nouveaux paramètres')

        # assert redirection worked
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_list.html')




        

