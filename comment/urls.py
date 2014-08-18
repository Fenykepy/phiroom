from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from user.views import user_is_staff

urlpatterns = patterns('',
#        url(r'^post/$', 'comments.post_comment', name='comments-post-comment'),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
