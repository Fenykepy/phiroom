import os

from django.test import TestCase
from django.core.urlresolvers import reverse

from rest_framework.test import APIClient, APITestCase

from phiroom.tests_utils import test_status_codes
from user.models import User



def create_test_users(instance):
    """Create users for tests:
        - One normal user
        - One staff member
        - One superuser
        - One weblogauthor
        - One librairymember
    """
    instance.superUser = User.objects.create_superuser(
        username="bob",
        first_name="robert",
        last_name="chin",
        email='bob@phiroom.org',
        password='top_secret',
    )
    # set this here because save User's methods isn't call
    # when usinge create_user or create_superuser
    instance.superUser.is_staff = True
    instance.superUser.is_weblog_author = True
    instance.superUser.mail_contact = True
    instance.superUser.mail_registration = True
    instance.superUser.save()

    instance.staffUser = User.objects.create_user(
        username="tom",
        first_name="Tom",
        last_name="Poe",
        email='tom@phiroom.org',
        password='top_secret',
    )
    instance.staffUser.is_staff = True
    instance.staffUser.is_weblog_author = True
    instance.staffUser.mail_contact = True
    instance.staffUser.mail_registration = True
    instance.staffUser.save()
    
    instance.weblogAuthorUser = User.objects.create_user(
        username="Bill",
        email='bill@phiroom.org',
        password='top_secret',
    )
    instance.weblogAuthorUser.is_weblog_author = True
    instance.weblogAuthorUser.save()
   
    instance.librairyMemberUser = User.objects.create_user(
        username="Jim",
        email='jim@phiroom.org',
        password='top_secret',
    )
    instance.librairyMemberUser.is_librairy_member = True
    instance.librairyMemberUser.save()

    instance.normalUser = User.objects.create_user(
        username="John",
        email='john@phiroom.org',
        password='top_secret',
    )
    instance.normalUser.save()





def login(instance, user):
    """Login with given user, assert it's ok"""
    login = instance.client.login(username=user.username,
            password='top_secret')
    instance.assertEqual(login, True)



class ModelTest(TestCase):
    """Class to test user model."""

    def setUp(self):
        # create users
        create_test_users(self)


    def test_get_short_name(self):
        # should return first_name
        short_name = self.staffUser.get_short_name()
        self.assertEqual(short_name, "Tom")

        # should return username as no first_name
        short_name = self.normalUser.get_short_name()
        self.assertEqual(short_name, "John")


    def test_get_full_name(self):
        # should return first_name + last_name
        full_name = self.staffUser.get_full_name()
        self.assertEqual(full_name, "Tom Poe")

        # should return get_short_name (so username)
        full_name = self.normalUser.get_full_name()
        self.assertEqual(full_name, 'John')


    def test_save(self):
        # should have set user author_name to get_full_name()
        self.assertEqual(self.staffUser.author_name, "Tom Poe")
        # should have set user mail_contact and mail_registration to True
        self.assertTrue(self.staffUser.mail_contact)
        self.assertTrue(self.staffUser.mail_registration)




class UserAPITest(TestCase):
    """User API test class."""

    def setUp(self):
        # create un user
        create_test_users(self)

        self.client = APIClient()


    def test_token_login(self):
        url = '/api/token-auth/'
        user_url = '/api/users/current/'

        # shouldn't return token with bad user credentials
        response = self.client.post(url, {'username': "Paul", 'password': "no"})
        self.assertEqual(response.status_code, 400)
        # should return token with good user credentials
        response = self.client.post(url, {'username': "John", 'password': "top_secret"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
        token = response.data['token']
        # should be able to access user info with token in cookie
        self.client.cookies['auth_token'] = token
        # should be able to access user info with token in header
        #self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = self.client.get(user_url)
        self.assertEqual(response.status_code, 200)


    def test_token_verify(self):
        auth_url = '/api/token-auth/'
        url = '/api/token-verify/'
        # get token
        response = self.client.post(auth_url, {'username': "John", 'password': "top_secret"})
        token = response.data['token']
        # token should be verified
        response = self.client.post(url, {'token': token})
        self.assertEqual(response.status_code, 200)
        # false token should return error
        response = self.client.post(url, {'token': 'naiteananetiaet.ntietadpena.naitentaea'})
        self.assertEqual(response.status_code, 400)


    def test_token_refresh(self):
        auth_url = '/api/token-auth/'
        url = '/api/token-refresh/'
        # get token
        response = self.client.post(auth_url, {'username': "John", 'password': "top_secret"})
        token = response.data['token']
        # token should be refreshed
        response = self.client.post(url, {'token': token})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
        # false token should return error
        response = self.client.post(url, {'token': 'naiteananetiaet.ntietadpena.naitentaea'})
        self.assertEqual(response.status_code, 400)


    def test_current_user(self):
        url = '/api/users/current/'
        data = {"first_name": "John",
                "last_name": "Poe",
        }
        # full data's for put
        data2 = {
	    "username": "johnpoe",
	    "first_name": "john",
	    "last_name": "poe",
	    "author_name": "fred",
	}

        # test without login
        # nothing should be accessible
        test_status_codes(self, url, [401, 401, 401, 401, 401])

        # login with normal user
        login(self, self.normalUser)
        # detail should be accessible
        test_status_codes(self, url, [200, 405, 200, 200, 405],
            postData = data, putData = data2, patchData = data)


    def test_author_detail(self):
        base_url = '/api/users/author/{}/'
        data = {"first_name": "John",
                "last_name": "Poe",
        }

        # test without login
        url = base_url.format(self.staffUser.pk)
        test_status_codes(self, url, [200, 405, 405, 405, 405])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], self.staffUser.username)
        self.assertEqual(response.data['website'], self.staffUser.website)
        self.assertEqual(response.data['author_name'], self.staffUser.author_name)
        self.assertEqual(response.data['avatar'], self.staffUser.avatar)
        self.assertEqual(response.data['flickr_link'], self.staffUser.flickr_link)
        self.assertEqual(response.data['twitter_link'], self.staffUser.twitter_link)
        self.assertEqual(response.data['gplus_link'], self.staffUser.gplus_link)
        self.assertEqual(response.data['facebook_link'], self.staffUser.facebook_link)
        self.assertEqual(response.data['pinterest_link'], self.staffUser.pinterest_link)
        self.assertEqual(response.data['vk_link'], self.staffUser.vk_link)
        self.assertEqual(response.data['insta_link'], self.staffUser.insta_link)
 
        # test with staff member
        login(self, self.staffUser)
        # shouldn't get anything more
        test_status_codes(self, url, [200, 405, 405, 405, 405])
        
        # try to get a non author user
        login(self, self.normalUser)
        url = base_url.format(self.normalUser.pk)
        test_status_codes(self, url, [200, 405, 405, 405, 405])



