#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import user_passes_test


from conf.views import SetNewSettings, ListSettings
from weblog.views import ListEntrys
from user.views import user_is_staff

urlpatterns = patterns('',
        url(r'^$', user_passes_test(user_is_staff)(SetNewSettings.as_view()), name="conf_settings"),
        url(r'^list/$', user_passes_test(user_is_staff)(ListSettings.as_view()), name="list_settings"),
)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
