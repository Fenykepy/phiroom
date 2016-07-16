from django.conf.urls import patterns, url

from cache.utils import clearable_cache_page

from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from conf import views



urlpatterns = [
        url(r'^latest/$', clearable_cache_page(
                None)(views.LastConf.as_view()),
            name="last-conf"),
        url(r'^main-menu/$', views.MainMenu.as_view(),
            name="main-menu"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

