#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

#import librairy.views
from librairy import views


urlpatterns = [
        url(r'^pictures/$', views.PicturesList.as_view(),
            name="picture-list"),
        url(r'^pictures/(?P<pk>[0-9]+)/$', views.PictureDetail.as_view(),
            name="picture-detail"),
        url(r'^directorys/$', views.DirectorysList.as_view(),
            name="directory-list"),
        url(r'^directorys/(?P<pk>[0-9]+)/$', views.DirectoryDetail.as_view(),
            name="directory-detail"),
        url(r'^directorys/(?P<pk>[0-9-]+)/pictures/$', views.DirectoryPicturesList.as_view(),
            name="directory-pictures-list"),
]

urlpatterns = format_suffix_patterns(urlpatterns)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()