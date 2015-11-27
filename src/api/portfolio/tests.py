from django.test import TestCase

from rest_framework.test import APIClient, APITestCase

from user.models import User
from librairy.models import Picture
from portfolio.models import Portfolio, PortfolioPicture

from librairy.tests import create_test_picture
from weblog.tests import create_test_users, login
from librairy.tests import create_test_picture


def create_test_portfolio(instance):
    """Create 3 portfolios for tests.
    Run create_test_users first.
    """
    instance.portfolio = Portfolio.objects.create(
        title="My first title",
        description="My first description",
        author=instance.user
    )
    instance.portfolio2 = Portfolio.objects.create(
        title="My second title",
        description="My second description",
        author=instance.user
    )
    instance.portfolio3 = Portfolio.objects.create(
        title="My third title",
        description="My third description",
        author=instance.user
    )
