from rest_framework.test import APIClient, APITestCase

from user.tests import create_test_users, login

from phiroom.tests_utils import test_status_codes

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
        test_status_codes(self, url, [200, 405, 405, 405, 405],
            postData=data, putData=data, patchData=data)
        
        # client should get token
        response=self.client.get(url)
        self.assertTrue(response.data['token'])
        
        # test with normal user
        login(self, self.normalUser)
        test_status_codes(self, url, [200, 405, 405, 405, 405],
            postData=data, putData=data, patchData=data)
 
        # client should get token
        response=self.client.get(url)
        self.assertTrue(response.data['token'])

        # test with staff member
        login(self, self.staffUser)
        test_status_codes(self, url, [200, 405, 405, 405, 405],
            postData=data, putData=data, patchData=data)

        # client should get token
        response=self.client.get(url)
        self.assertTrue(response.data['token'])
        
