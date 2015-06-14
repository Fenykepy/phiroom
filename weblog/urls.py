#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from weblog import views


urlpatterns = [
        url(r'^posts/$', views.PostList.as_view(),
            name="post-list"),
        url(r'^posts/(?P<pk>[0-9]+)/$', views.PostDetail.as_view(),
            name="post-detail"),
        url(r'^tags/$', views.TagList.as_view(),
            name="tag-list"),
        url(r'^tags/(?P<pk>[0-9]+)/$', views.TagDetail.as_view(),
            name="tag-detail"),
        url('^posts-by-tag/(?P<slug>[-\w]+)/$', views.PostsListByTag.as_view(),
            name="post-list-by-tag"),
]

urlpatterns = format_suffix_patterns(urlpatterns)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
