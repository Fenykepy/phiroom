import os

from django.test import TestCase
from django.core.urlresolvers import reverse

from rest_framework.test import APIClient, APITestCase

from user.models import User



def create_test_users(instance):
    """Create two users for tests."""
    instance.user = User.objects.create_superuser(
        username="tom",
        first_name="Tom",
        last_name="Poe",
        email='tom@phiroom.org',
        password='top_secret',
    )
    instance.user.is_staff = True
    instance.user.save()

    instance.user2 = User.objects.create_user(
        username="John",
        email='john@phiroom.org',
        password='top_secret',
    )
    instance.user2.save()





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
        short_name = self.user.get_short_name()
        self.assertEqual(short_name, "Tom")

        # should return username as no first_name
        short_name = self.user2.get_short_name()
        self.assertEqual(short_name, "John")


    def test_get_full_name(self):
        # should return first_name + last_name
        full_name = self.user.get_full_name()
        self.assertEqual(full_name, "Tom Poe")

        # should return get_short_name (so username)
        full_name = self.user2.get_full_name()
        self.assertEqual(full_name, 'John')


    def test_save(self):
        # should have set user author_name to get_full_name()
        self.assertEqual(self.user.author_name, "Tom Poe")
        # should have set user mail_contact and mail_registration to True
        self.assertTrue(self.user.mail_contact)
        self.assertTrue(self.user.mail_registration)




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
        # should be able to access user info with token in header
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
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

        # test without login
        # nothing should be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # login with normal user
        login(self, self.user2)
        # detail should be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)
        






