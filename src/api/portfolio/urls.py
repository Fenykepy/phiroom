from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from portfolio import views

urlpatterns = [
    url(r'$', views.PortfolioList.as_view(),
        name="portfolio-list"),
    url(r'(?P<slug>[-\w]+)/$', views.PortfolioDetail.as_view(),
        name="portfolio-detail"),

]
