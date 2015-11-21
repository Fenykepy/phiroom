from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework.urlpatterns import format_suffix_patterns

from portfolio import views

urlpatterns = [
    url(r'^$', views.portfolio_root,
        name="portfolio-root"),
    url(r'^portfolios/$', views.PortfolioList.as_view(),
        name="portfolios-list"),
    url(r'^portfolios/headers/$', views.portfolios_headers_list,
        name="portfolios-headers"),
    url(r'^portfolios/(?P<slug>[-\w]+)/$', views.PortfolioDetail.as_view(),
        name="portfolio-detail"),
]
