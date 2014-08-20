from django.test import TestCase

from stats.models import View
from stats.middleware import StatsMiddleware

## What to test:
# Assert that /assets/ urls are not logged in
# Assert that /media/ urls are not logged in
# Assert that other views are logged in
# Assert that authenticated users are indicated
# Assert that staff members are indicated




