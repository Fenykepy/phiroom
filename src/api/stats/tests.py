from django.test import TestCase

from rest_framework.test import APIClient, APITestCase

from user.models import User
from user.tests import create_test_users, login

from phiroom.tests_utils import test_status_codes

from stats.models import Hit

class HitModelTest(TestCase):
    """Hit model test class."""

    def test_portfolio_hit_creation(self):
        hit = Hit.objects.create(
                ip = '233',
                type = 'PORT',
                related_key = '1'
        )

        # assert hit has been saved in db
        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.ip, '233')
        self.assertEqual(hit.type, 'PORT')
        self.assertEqual(hit.related_key, '1')
        self.assertEqual(hit.user, None)


    def test_post_hit_creation(self):
        hit = Hit.objects.create(
                type = 'POST',
                related_key = '1'
        )

        # assert hit has been saved in db
        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.ip, '')
        self.assertEqual(hit.type, 'POST')
        self.assertEqual(hit.related_key, '1')
        self.assertEqual(hit.user, None)


    def test_picture_hit_creation(self):
        hit = Hit.objects.create(
                ip = '234',
                type = 'PICT',
                related_key = '1'
        )

        # assert hit has been saved in db
        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.ip, '234')
        self.assertEqual(hit.type, 'PICT')
        self.assertEqual(hit.related_key, '1')
        self.assertEqual(hit.user, None)


    def test_contact_hit_creation(self):
        hit = Hit.objects.create(
                ip = '234',
                type = 'CONTACT',
        )

        # assert hit has been saved in db
        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.ip, '234')
        self.assertEqual(hit.type, 'CONTACT')
        self.assertEqual(hit.user, None)



class StatsAPITest(APITestCase):
    """Stats API test class."""

    def setUp(self):
        # create users
        create_test_users(self)


    def test_hits_list_access(self):
        url = '/api/stats/hits/'
        data = {
            'ip': '127.0.0.1',
            'type': 'PORT',
            'related_key': '1',
        }
        data2 = {
            'type': 'CONTACT',
        }

        # test without login
        test_status_codes(self, url, [401, 201, 401, 401, 401],
            postData=data, putData=data, patchData=data)
 
        # test with normal user
        login(self, self.normalUser)
        test_status_codes(self, url, [403, 201, 403, 403, 403],
            postData=data, putData=data, patchData=data)
        
        # test with staff member
        login(self, self.staffUser)
        test_status_codes(self, url, [200, 201, 403, 403, 405],
            postData=data, putData=data, patchData=data)


    def test_contact_hit_creation(self):
        url = '/api/stats/hits/'
        data = {
            'type': 'CONTACT',
        }

        # test with normal user
        login(self, self.normalUser)
        response=self.client.post(url, data)

        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.type, 'CONTACT')
        self.assertEqual(hit.user, self.normalUser)
        self.assertTrue(hit.ip)
        self.assertTrue(hit.request_ip)
        self.assertTrue(hit.request_ip == hit.ip)


    def test_portfolio_hit_creation(self):
        url = '/api/stats/hits/'
        data = {
            'ip': '127.0.0.3',
            'type': 'PORT',
            'related_key': '1',
        }

        # test with normal user
        response=self.client.post(url, data)

        hit = Hit.objects.get(pk=1)
        self.assertEqual(hit.type, 'PORT')
        self.assertEqual(hit.related_key, '1')
        self.assertEqual(hit.user, None)
        self.assertEqual(hit.ip, '127.0.0.3')
        self.assertTrue(hit.request_ip)






        
