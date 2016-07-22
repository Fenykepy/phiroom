from django.conf.urls import patterns, url

from django.views.decorators.cache import cache_page
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from conf import views



urlpatterns = [
        url(r'^latest/$', cache_page(None)(views.LastConf.as_view()),
            name="last-conf"),
        url(r'^main-menu/$', views.MainMenu.as_view(),
            name="main-menu"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

