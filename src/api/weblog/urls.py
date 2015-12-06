from django.conf.urls import url

from weblog import views

urlpatterns = [

        url(r'^posts/$', views.PostList.as_view(),
            name="posts-list"),
        url(r'^posts/headers/$', views.posts_headers_list,
            name="posts-headers-list"),
        url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/$', views.PostDetail.as_view(),
            name="post-detail"),
        url(r'^tags/$', views.TagList.as_view(),
            name="tags-list"),
        url(r'^flat-tags/$', views.flat_tags_list,
            name="flat-tags-list"),
        url(r'^tags/(?P<pk>[0-9]+)/$', views.TagDetail.as_view(),
            name="tag-detail"),
        url('^posts/tag/(?P<slug>[-\w]+)/$', views.PostsListByTag.as_view(),
            name="post-list-by-tag"),
]
