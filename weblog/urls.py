from django.conf.urls import patterns, url
from weblog.views import *



urlpatterns = patterns('',
    ## posts list
    url(r'^$', ListPosts.as_view(), name="weblog_home"),
    url(r'^page/(?P<page>\d+)/$', ListPosts.as_view(), name="weblog_home"),

    ## posts list by tags
    url(r'^tag/(?P<slug>[-\w]+)/$', ListPostsByTag.as_view(), name="weblog_tag"),
    url(r'^tag/(?P<slug>[-\w]+)/page/(?P<page>\d+)/$', ListPostsByTag.as_view(),
        name="weblog_tag"),

    ## post detail view
    url(r'^(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/$', ViewPost.as_view(),
        name="post_view"),

)
