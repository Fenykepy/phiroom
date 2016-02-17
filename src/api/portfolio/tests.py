from datetime import datetime, timedelta

from django.test import TestCase
from django.utils import timezone

from rest_framework.test import APIClient, APITestCase

from user.models import User
from librairy.models import Picture
from portfolio.models import Portfolio, PortfolioPicture

from librairy.tests import create_test_picture
from user.tests import create_test_users, login
from librairy.tests import create_test_picture


def create_test_portfolios(instance):
    """Create 3 portfolios for tests.
    Run create_test_users first.
    """
    instance.port = Portfolio.objects.create(
        title="My first title",
        author=instance.staffUser
    )
    instance.port2 = Portfolio.objects.create(
        title="My second title",
        author=instance.normalUser
    )
    instance.port3 = Portfolio.objects.create(
        title="My third title",
        author=instance.staffUser
    )

class PortfolioModelTest(TestCase):
    """Portfolio model test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create test pictures
        create_test_picture()
        # create portfolios
        create_test_portfolios(self)


    def test_portfolio_creation(self):
        # create a portfolio
        port = Portfolio(
            title="My title",
            author=self.staffUser
        )
        port.save()
        # assert slug is correctly generated
        self.assertEqual(port.slug, "my-title")
        # assert portfolio is in published manager
        n_port = Portfolio.published.all().count()
        self.assertEqual(n_port, 4)
        # assert published manager delivers last portfolio first
        ports = Portfolio.published.all()
        self.assertEqual(port, ports[0])
        # create a new portfolio with same title
        port2 = Portfolio(
            title="My title",
            order=2,
            author=self.staffUser
        )
        port2.save()
        # assert slugs are unique
        self.assertTrue(port.slug != port2.slug)
        # assert it's last in published manager
        ports = Portfolio.published.all()
        self.assertEqual(port2, ports[4])



    def test_draft_future_posts(self):
        self.port3.draft = True
        self.port3.save()

        # assert it's not anymore in published manager results
        n_ports = Portfolio.published.all().count()
        self.assertEqual(n_ports, 2)

        # pass port2 in future
        self.port2.pub_date = timezone.now() + timedelta(hours=24)
        self.port2.save()

        # assert port2 isn't anymore in published manager results
        n_ports = Portfolio.published.all().count()
        self.assertEqual(n_ports, 1)


        
class PortfolioPictureModelTest(TestCase):
    """PortfolioPicture model test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create portfolios
        create_test_portfolios(self)
        # create pictures
        self.pict = create_test_picture()
        self.pict2 = create_test_picture()



    def test_create_PortfolioPicture(self):
        pp = PortfolioPicture(
                portfolio=self.port,
                picture=self.pict)
        pp.order = 28
        pp.save()

        # PortfolioPicture object should have been saved in db
        p = PortfolioPicture.objects.get(pk=1)
        self.assertEqual(p.picture, self.pict)
        self.assertEqual(p.portfolio, self.port)
        self.assertEqual(p.order, 28)


    def test_portfolio_list_picture(self):
        pp = PortfolioPicture(
                portfolio=self.port,
                picture=self.pict)
        pp.order = 3
        pp.save()
        pp2 = PortfolioPicture(
                portfolio=self.port,
                picture=self.pict2)
        pp2.order = 1
        pp2.save()
        # picture list should be ordered by "order"
        picts = self.port.get_pictures()
        self.assertEqual(picts[0], pp2)
        self.assertEqual(picts[1], pp)



class PortfolioAPITest(APITestCase):
    """Portfolio API Test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create portfolios
        create_test_portfolios(self)
        # create pictures
        self.pict = create_test_picture()
        self.pict2 = create_test_picture()

        self.client = APIClient()


    def test_portfolios_headers(self):
        url = '/api/portfolio/headers/'

        # pass port3 draft
        self.port3.draft = True
        self.port3.save()
        
        # test without login
        # client shouldn't receive unpublished portfolios
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['slug'], "my-second-title")

        # test with normal user
        # client shouldn't receive unpublished portfolios
        login(self, self.normalUser)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        
        # test with admin user
        # client should have all posts
        login(self, self.staffUser)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        
        data = {'slug': "slug", 'title': "title"}
        
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)
        
    
    def test_portfolio_picture_list(self):

        # create test portfolio-picture
        pp2 = PortfolioPicture.objects.create(
                portfolio=self.port,
                picture=self.pict2)


        url = '/api/portfolio/portfolio-picture/'
        data = {'order': 10,
                'picture': self.pict.pk,
                'portfolio': self.port.slug
        }
        data2 = {'order': 1,
                'picture': self.pict.pk,
                'portfolio': self.port.slug
        }
 
        # test without login
        # client shouldn't get list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.staffUser)
        # client should get all portfolios list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # assert portfolio has been saved in db
        pp_new = PortfolioPicture.objects.get(pk=2)
        # assert user has been saved as author
        self.assertEqual(pp_new.picture, self.pict)
        self.assertEqual(pp_new.portfolio, self.port)
        self.assertEqual(pp_new.order, 10)
        # Creating 2 portfolioPicture relation with same picture and portfolio
        # shouldn't be possible
        count = PortfolioPicture.objects.all().count()
        response = self.client.post(url, data2)
        self.assertEqual(response.status_code, 400)
        count2 = PortfolioPicture.objects.all().count()
        self.assertEqual(count, count2)
        # assert object hasn't change
        pp_new = PortfolioPicture.objects.get(pk=2)
        self.assertEqual(pp_new.order, 10)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)

 

    def test_portfolio_picture_detail(self):

        # create test portfolio-picture
        pp = PortfolioPicture.objects.create(
                portfolio=self.port,
                picture=self.pict2)


        url = '/api/portfolio/portfolio-picture/portfolio/{}/picture/{}/'.format(
                self.port.slug, self.pict2.pk
        )
        data = {'order': 10,
                'picture': self.pict2.pk,
                'portfolio': self.port.slug
        }
        data2 = {'order': 1,
                'picture': self.pict2.pk,
                'portfolio': self.port.slug
        }

        # test without login
        # client shouldn't get
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client shouldn't get 
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 403)
        
        # test with staff member
        login(self, self.staffUser)
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client should be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        # client should be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 200)
        pp = PortfolioPicture.objects.get(
                portfolio=self.port,
                picture=self.pict2)
        # assert order has been updated
        self.assertEqual(pp.order, 1)
        # client should be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)      



    def test_portfolios_list(self):
        url = '/api/portfolio/portfolios/'
        data = {'title': 'portfolio title',
                'draft': False,
        }
        data2 = {'title': 'new portfolio title'}

        # pass port3 draft
        self.port3.draft = True
        self.port3.save()

        # test without login
        # client should get published portfolios list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client should get published portfolios list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.staffUser)
        # client should get all portfolios list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 3)
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # assert portfolio has been saved in db
        port = Portfolio.objects.get(slug="portfolio-title")
        # assert user has been saved as author
        self.assertEqual(port.author, self.staffUser)

        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)


    def test_portfolio_detail(self):
        url = '/api/portfolio/portfolios/{}/'.format(
                self.port.slug)
        url3 = '/api/portfolio/portfolios/{}/'.format(
                self.port3.slug)
        data = {'title': 'My first title',
                'draft': False,
        }
        data2 = {'draft': True}

        # pass port3 draft
        self.port3.draft = True
        self.port3.save()

        # test without login
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to get draft port
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to get draft port
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 403)
        
        # test with staff member
        login(self, self.staffUser)
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client should be able to get draft port
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client should be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['draft'], False)
        # client should be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['draft'], True)

        # client should be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)



    def test_portfolio_pictures(self):
        url = '/api/portfolio/portfolios/{}/pictures/'.format(
                self.port.slug)
        url3 = '/api/portfolio/portfolios/{}/pictures/'.format(
                self.port3.slug)
        data = {'pictures': [2, 1]}

        # pass port3 draft
        self.port3.draft = True
        self.port3.save()
        # add pictures to port
        pp = PortfolioPicture(
                portfolio=self.port,
                picture=self.pict)
        pp.order = 3
        pp.save()
        pp2 = PortfolioPicture(
                portfolio=self.port,
                picture=self.pict2)
        pp2.order = 1
        pp2.save()

        self.pict.title = 'title 1'
        self.pict.legend = 'legend 1'
        self.pict.previews_path = 'xx/xx/xxxxxx'
        self.pict.ratio = 0.75
        self.pict.save()
 
        self.pict2.title = 'title 2'
        self.pict2.legend = 'legend 2'
        self.pict2.previews_path = 'xx/xx/xxxxxx'
        self.pict2.ratio = 0.70
        self.pict2.save()   
        
        # test without login
        # client should get port pictures
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data1 = response.data
        self.assertTrue(data1[0]['pk'])
        self.assertTrue(data1[0]['sha1'])
        self.assertEqual(data1[0]['title'], 'title 1')
        self.assertEqual(data1[0]['legend'], 'legend 1')
        self.assertEqual(data1[0]['previews_path'], 'xx/xx/xxxxxx')
        self.assertEqual(data1[0]['ratio'], 0.75)
        
        self.assertTrue(data1[1]['pk'])
        self.assertTrue(data1[1]['sha1'])
        self.assertEqual(data1[1]['title'], 'title 2')
        self.assertEqual(data1[1]['legend'], 'legend 2')
        self.assertEqual(data1[1]['previews_path'], 'xx/xx/xxxxxx')
        self.assertEqual(data1[1]['ratio'], 0.70)
        # client shouldn't be able to get draft port pictures
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post 
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to get draft port
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 403)
        
        # test with staff member
        login(self, self.staffUser)
        # client should get port
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client should be able to get draft port
        response = self.client.get(url3)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, 405)


