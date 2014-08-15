from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from weblog.views import user_is_staff
from contact.views import ViewContact, UpdateContact, SentMessage

urlpatterns = patterns('',
        url(r'^$', ViewContact.as_view(), name="contact_home"),
        url(r'^edit/$', user_passes_test(user_is_staff)(UpdateContact.as_view()), name="contact_edit"),
        url(r'^sent/$', SentMessage.as_view(), name="contact_sent"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
