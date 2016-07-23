from django.conf.urls import url

from django.views.decorators.cache import cache_page

from weblog import views

urlpatterns = [
    url(r'^$', views.weblog_root,
        name="weblog-root"),
    url(r'^posts/$', cache_page(None)(views.PostList.as_view()),
        name="posts-list"),
    url(r'^posts/headers/$', cache_page(None)(views.posts_headers_list),
        name="posts-headers"),
    url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/$', cache_page(None)(
        views.PostDetail.as_view()),
        name="post-detail"),
    url(r'^tags/$', cache_page(None)(views.TagList.as_view()),
        name="tags-list"),
    url(r'^flat-tags/$', cache_page(None)(views.flat_tags_list),
        name="flat-tags-list"),
    url(r'^tags/(?P<pk>[0-9]+)/$', cache_page(None)(views.TagDetail.as_view()),
        name="tag-detail"),
    url(r'^posts/tag/(?P<slug>[-\w]+)/$', cache_page(None)(views.PostsListByTag.as_view()),
        name="post-list-by-tag"),

    url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/pictures/$',
        cache_page(None)(views.post_pictures),
        name="post-pictures"),
    url(r'^posts/(?P<slug>\d{4}/\d{2}/\d{2}/[-\w]+)/hits/$',
        cache_page(60 * 3)(views.post_hits),
        name="post-hits"),

    url(r'^post-picture/$', cache_page(None)(views.PostPictureList.as_view()),
        name="post-picture-list"),
    url(r'^post-picture/post/(?P<post>\d{4}/\d{2}/\d{2}/[-\w]+)/picture/(?P<picture>[0-9A-Fa-f]{40})/$',
        cache_page(None)(views.PostPictureDetail.as_view()),
        name="post-picture-detail"),
]
