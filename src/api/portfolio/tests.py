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
        author=instance.user
    )
    instance.port2 = Portfolio.objects.create(
        title="My second title",
        author=instance.user
    )
    instance.port3 = Portfolio.objects.create(
        title="My third title",
        author=instance.user
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
            author=self.user
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
            author=self.user
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
        self.assertEqual(picts[0], self.pict2)
        self.assertEqual(picts[1], self.pict)
