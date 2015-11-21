#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

#import librairy.views
from librairy import views


urlpatterns = [
        url(r'^pictures/$', views.PicturesList.as_view(),
            name="pictures-list"),
        url(r'^pictures/(?P<pk>[0-9]+)/$', views.PictureDetail.as_view(),
            name="picture-detail"),
        url(r'^pictures/(?P<pk>[0-9]+)/short/$', views.PictureShortDetail.as_view(),
            name="picture-detail-short"),

        url(r'^directories/$', views.DirectoriesList.as_view(),
            name="directories-list"),
        url(r'^directories/(?P<pk>[0-9]+)/$', views.DirectoryDetail.as_view(),
            name="directory-detail"),
        url(r'^directories/(?P<pk>[0-9-]+)/pictures/$', views.DirectoryPicturesList.as_view(),
            name="directory-pictures-list"),

        url(r'^posts/(?P<pk>[0-9]+)/pictures/$', views.PostPicturesList.as_view(),
            name="post-pictures-list"),

        url(r'^post-pict/$', views.PostPictureCreate.as_view(),
            name="post-picture-create"), # api endpoint to create post / pictures relation
        url(r'^post-pict/post/(?P<post>[0-9]+)/pict/(?P<pict>[0-9]+)/$',
            views.PostPictureDetail.as_view(),
            name="post-picture-detail"), # api endpoint to delete or update post / pictures relation

]

urlpatterns = format_suffix_patterns(urlpatterns)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
