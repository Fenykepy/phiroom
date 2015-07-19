from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework.urlpatterns import format_suffix_patterns

from user import views


urlpatterns = [
        url(r'^current/$', views.RequestUser.as_view(),
            name="request-user"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

