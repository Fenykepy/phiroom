from django.conf.urls import url

from weblog import views

urlpatterns = [
    url(r'^$', views.weblog_root,
        name="weblog-root"),
    url(r'^posts/$', views.PostList.as_view(),
        name="posts-list"),
    url(r'^posts/headers/$', views.posts_headers_list,
        name="posts-headers"),
    url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/$', views.PostDetail.as_view(),
        name="post-detail"),
    url(r'^tags/$', views.TagList.as_view(),
        name="tags-list"),
    url(r'^flat-tags/$', views.flat_tags_list,
        name="flat-tags-list"),
    url(r'^tags/(?P<pk>[0-9]+)/$', views.TagDetail.as_view(),
        name="tag-detail"),
    url(r'^posts/tag/(?P<slug>[-\w]+)/$', views.PostsListByTag.as_view(),
        name="post-list-by-tag"),

    url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/pictures/$',
        views.post_pictures,
        name="post-pictures"),

    url(r'^post-picture/$', views.PostPictureList.as_view(),
        name="post-picture-list"),
    url(r'^post-picture/post/(?P<post>\d{4}/\d{2}/\d{2}/[-\w]+)/picture/(?P<picture>[0-9]+)/$',
        views.PostPictureDetail.as_view(),
        name="post-picture-detail"),
]
