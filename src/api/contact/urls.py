from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from contact import views

urlpatterns = [
    url(r'^description/$', views.LastDescription.as_view(),
        name="contact-description"),
]
