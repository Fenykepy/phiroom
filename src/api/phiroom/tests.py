from rest_framework.test import APIClient, APITestCase

from user.tests import create_test_users, login

class CSRFTokenAPITest(APITestCase):
    """CSRF token API test class."""

    def setUp(self):
        # create users
        create_test_users(self)

        self.client = APIClient()

    def test_get_csrf_token(self):
        url = '/api/token-csrf/'
        data = {
            'toto': '',
            'test': 'titi',
        }
        # test without login
        # client should get token
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
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
        login(self, self.user2)
        # client should get token
        response=self.client.get(url)
        self.assertTrue(response.data['token'])
        self.assertEqual(response.status_code, 200)
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
        login(self, self.user)
        # client should get token
        response=self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
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
