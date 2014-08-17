from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from weblog.views import user_is_staff
from pictofday.views import ViewPictofday, UpdatePictofday, DeletePictofday, CreatePictofday, ViewLastPictofday

urlpatterns = patterns('',
        url(r'^$', ViewLastPictofday.as_view(), name="pictofday_home"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/edit/$', user_passes_test(user_is_staff)(UpdatePictofday.as_view()), name="pictofday_edit"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/delete/$', user_passes_test(user_is_staff)(DeletePictofday.as_view()), name="pictofday_delete"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/$', ViewPictofday.as_view(), name="pictofday_view"),
        url(r'^create/$', user_passes_test(user_is_staff)(CreatePictofday.as_view()), name="pictofday_create"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
