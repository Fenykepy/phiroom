#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test, login_required

from weblog.views import user_is_staff
from user.views import LoginView, SuscriptionView, ProfilView, RecoveryView


urlpatterns = patterns('user.views',
    url(r'^login/$', LoginView.as_view(), name="user_login"),
    url(r'^logout/$', 'logout_view', name="user_logout"),
    url(r'^suscription/$', SuscriptionView.as_view(), name="user_suscription"),
    url(r'^profil/$', login_required(ProfilView.as_view()), name="user_profil"),
    url(r'^recovery/$', RecoveryView.as_view(), name="user_recovery"),
)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
