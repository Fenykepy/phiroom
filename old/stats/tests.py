from django.test import TestCase, Client

from stats.models import View
from stats.middleware import StatsMiddleware
from user.models import User
from phiroom.settings import MEDIA_URL, STATIC_URL

## What to test:
# Assert that /assets/ urls are not logged in
# Assert that /media/ urls are not logged in
# Assert that other views are logged in
# Assert that authenticated users are indicated
# Assert that staff members are indicated

class statsTest(TestCase):
    """Stats app tests."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='jacob',
            email='jacob@toto.com',
            password='top_secret'
        )
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()

        self.user2 = User.objects.create_user(
            username='tartempion',
            email='tartempion@tartempion.fr',
            password='toto'
        )

        self.client = Client()


    def test_statics(self):
        """Test that STATIC_URL urls aren't logged in."""
        response = self.client.get(STATIC_URL +
                'images/structure/css/cadre2h.png')
        response = self.client.get(STATIC_URL +
                'css/phiroom.min.cs')
        response = self.client.get(STATIC_URL +
                'scripts/phiroomui.compiled.js')

        count = View.objects.all().count()
        self.assertEqual(count, 0)


    def test_media(self):
        """Test that MEDIA_URL urls aren't logged in."""
        response = self.client.get(MEDIA_URL +
                '/phiroom/data/images/librairy/sample1/FLR_12_4502.jpg')

        count = View.objects.all().count()
        self.assertEqual(count, 0)


    def test_normal_user(self):
        """Test that other url's are logged in for anonymous users"""
        response = self.client.get('/weblog/')
        view = View.objects.latest('date')
        self.assertEqual(view.url, '/weblog/')

        response = self.client.get('/contact/')
        view = View.objects.latest('date')
        self.assertEqual(view.url, '/contact/')

        response = self.client.get('/portfolio/')
        view = View.objects.latest('date')
        self.assertEqual(view.url, '/portfolio/')
        
        # views should have been logged in
        count = View.objects.all().count()
        self.assertEqual(count, 3)

        # views shouldn't be with staff
        count = View.objects.filter(staff=True).count()
        self.assertEqual(count, 0)

        # views shouldn't be with authenticated
        count = View.objects.filter(user=None).count()
        self.assertEqual(count, 3)


    def test_authenticated_user(self):
        """Test that authenticated users are logged in."""
        # login with user tartempion
        login = self.client.login(username='tartempion', password='toto')
        self.assertEqual(login, True)
        response = self.client.get('/weblog/')
        response = self.client.get('/contact/')
        response = self.client.get('/portfolio/')
 
        # views should have been logged in
        count = View.objects.all().count()
        self.assertEqual(count, 3)

        # views shouldn't be with staff
        count = View.objects.filter(staff=True).count()
        self.assertEqual(count, 0)

        # views shouldn't be with authenticated
        count = View.objects.filter(user=self.user2).count()
        self.assertEqual(count, 3)


    def test_staff_user(self):
        """Test that authenticated users are logged in."""
        # login with user tartempion
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)
        response = self.client.get('/weblog/')
        response = self.client.get('/contact/')
        response = self.client.get('/portfolio/')
 
        # views should have been logged in
        count = View.objects.all().count()
        self.assertEqual(count, 3)

        # views should be with staff
        count = View.objects.filter(staff=True).count()
        self.assertEqual(count, 3)

        # views shouldn't be with authenticated
        count = View.objects.filter(user=self.user).count()
        self.assertEqual(count, 3)








        
        





