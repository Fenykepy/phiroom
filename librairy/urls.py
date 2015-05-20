#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

#import librairy.views
from librairy import views


urlpatterns = patterns('',
        url(r'^pictures/$', views.PicturesList.as_view()),
)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
