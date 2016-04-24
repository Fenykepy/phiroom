from django.conf.urls import url

from portfolio import views

urlpatterns = [
    url(r'^$', views.portfolio_root,
        name="portfolio-root"),
    url(r'^portfolios/$', views.PortfolioList.as_view(),
        name="portfolios-list"),
    url(r'^headers/$', views.portfolios_headers_list,
        name="portfolios-headers"),
    url(r'^portfolios/(?P<slug>[-\w]+)/$', views.PortfolioDetail.as_view(),
        name="portfolio-detail"),
    url(r'^portfolios/(?P<slug>[-\w]+)/pictures/$', views.portfolio_pictures,
        name="portfolio-pictures"),
    url(r'^portfolio-picture/$', views.PortfolioPictureList.as_view(),
        name="portfolio-picture-list"),
    url(r'^portfolio-picture/portfolio/(?P<portfolio>[-\w]+)/picture/(?P<picture>[0-9A-Fa-f]{40})/$',
        views.PortfolioPictureDetail.as_view(),
        name="portfolio-picture-detail"),
]
