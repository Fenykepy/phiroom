from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from django.core.urlresolvers import reverse

from user.models import User
from conf.models import Conf, Page

from user.tests import create_test_users, login
from phiroom.tests_utils import test_status_codes

class ConfModelTest(TestCase):
    """Conf model test class."""
    def test_fixtures(self):
        ## assert fixtures are correctly loaded
        # get default conf object
        conf = Conf.objects.latest()

        self.assertEqual(conf.pk, 1)
        self.assertEqual(conf.comment, "Default settings")

    def test_save_method(self):
        ## assert save method create a new conf entry
        conf = Conf.objects.latest()
        conf.comment = "New configuration"
        conf.save()
        # assert date has been set
        self.assertTrue(conf.date)

        self.assertEqual(Conf.objects.count(), 2)

        # assert latest conf is last saved one
        conf = Conf.objects.latest()
        self.assertEqual(conf.pk, 2)
        self.assertEqual(conf.comment, "New configuration")
    
    def test_get_home_page_state(self):
        # assert get_home_page_state returns good one
        conf = Conf.objects.latest()
        self.assertEqual(conf.get_home_page_state(), "portfolios")



class PageModelTest(TestCase):
    """Page model test class."""
    def test_fixtures(self):
        ## assert fixtures are correctly loaded
        initial = [
            {
                'pk': 1,
                'name': 'portfolios',
                'title': 'Portfolios',
                'menu': True,
                'pos': 1,
                'state': 'portfolios',
            },
            {
                'pk': 2,
                'name': 'weblog',
                'title': 'Weblog',
                'menu': True,
                'pos': 2,
                'state': 'weblog.list',
            },
            {
                'pk': 3,
                'name': 'contact',
                'title': 'Contact',
                'menu': True,
                'pos': 3,
                'state': 'contact',
            },
            {
                'pk': 4,
                'name': 'librairy',
                'title': 'Librairy',
                'menu': False,
                'pos': 0,
                'state': 'librairy',
            },
        ]
        pages = Page.objects.all().order_by('pk')
        index = 0
        for page in pages:
            self.assertEqual(page.pk, initial[index]['pk'])
            self.assertEqual(page.name, initial[index]['name'])
            self.assertEqual(page.title, initial[index]['title'])
            self.assertEqual(page.is_in_main_menu,
                    initial[index]['menu'])
            self.assertEqual(page.position_in_main_menu,
                    initial[index]['pos'])
            self.assertEqual(page.state,
                    initial[index]['state'])
            index += 1
        # assert no untested pages are here
        self.assertEqual(len(pages), 4)
        
    def test_main_menu_manager(self):
        # assert main_menu_manager returns good results
        pages = Page.main_menu.all()
        self.assertEqual(pages[0]['name'], 'portfolios')
        self.assertEqual(pages[0]['title'], 'Portfolios')
        self.assertEqual(pages[0]['state'], 'portfolios')
        self.assertEqual(pages[1]['name'], 'weblog')
        self.assertEqual(pages[2]['name'], 'contact')
        self.assertEqual(len(pages), 3)
        self.assertEqual(len(pages[0]), 3)

    def test_page_info_manager(self):
        # assert page info manager returns good results
        pages = Page.info.filter(name='portfolios')
        self.assertEqual(len(pages), 1)
        self.assertEqual(pages[0]['name'], 'portfolios')
        self.assertEqual(pages[0]['title'], 'Portfolios')
        self.assertEqual(len(pages[0]), 2)


class APITest(APITestCase):
    """Class to test rest API."""

    def setUp(self):
        # create users
        create_test_users(self)

        # setup client
        self.client = APIClient()


    def test_confAPI(self):
        url = reverse('last-conf')
        data = {'comment': "my comment"}

        # test without login
        test_status_codes(self, url, [200, 401, 401, 401, 401],
            postData=data, putData=data, patchData=data)
        
        # assert response is ok
        response = self.client.get(url)
        self.assertEqual(response.data['comment'], 'Default settings')
        self.assertEqual(response.data['home_page_state'], 'portfolios')
        
        # login with normal user
        login(self, self.normalUser)
        test_status_codes(self, url, [200, 403, 403, 403, 403],
            postData=data, putData=data, patchData=data)
        
        # only admin should have write access to settings
        # login with staff user
        login(self, self.staffUser)
        test_status_codes(self, url, [200, 405, 200, 200, 405],
            postData=data, putData=data, patchData=data)



    def test_pageAPI(self):
        conf = Conf.objects.latest()

        url = reverse('main-menu')

        # try to get last conf without login
        test_status_codes(self, url, [200, 401, 401, 401, 401])
        
        # assert response is ok
        response = self.client.get(url)

        self.assertEqual(response.data['results'][0]['name'], 'portfolios')
        self.assertEqual(response.data['results'][1]['name'], 'weblog')
        self.assertEqual(response.data['results'][2]['name'], 'contact')

        

