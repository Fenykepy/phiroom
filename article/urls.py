from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from weblog.views import user_is_staff

from article.views import ViewArticle, UpdateArticle, DeleteArticle, CreateArticle

urlpatterns = patterns('',
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/edit/$', user_passes_test(user_is_staff)(UpdateArticle.as_view()), name="article_edit"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/delete/$', user_passes_test(user_is_staff)(DeleteArticle.as_view()), name="article_delete"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/$', ViewArticle.as_view(), name="article_view"),
        url(r'^create/$', user_passes_test(user_is_staff)(CreateArticle.as_view()), name="article_create"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
