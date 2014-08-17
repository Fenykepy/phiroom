#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test


from user.views import user_is_staff
from portfolio.views import ListPortfolios

urlpatterns = patterns('',
        url(r'^$', ListPortfolios.as_view(), name="portfolio_home"),
#        url(r'^create/$', user_passes_test(user_is_staff)(CreatePortfolio.as_view()), name="portfolio_create"),
#        url(r'^(?P<slug>[-\w]+)/edit/$', user_passes_test(user_is_staff)(UpdatePortfolio.as_view()), name="portfolio_edit"),
#        url(r'^(?P<slug>[-\w]+)/delete/$', user_passes_test(user_is_staff)(DeletePortfolio.as_view()), name="portfolio_delete"),
#        url(r'^(?P<slug>[-\w]+)/$', ViewPortfolio.as_view(), name="portfolio_view"),


)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
