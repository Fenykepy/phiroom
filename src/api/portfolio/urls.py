from django.conf.urls import url

from django.views.decorators.cache import cache_page

from portfolio import views

urlpatterns = [
    url(r'^$', cache_page(None)(views.portfolio_root),
        name="portfolio-root"),
    url(r'^portfolios/$', cache_page(None)(views.PortfolioList.as_view()),
        name="portfolios-list"),
    url(r'^headers/$', cache_page(None)(views.portfolios_headers_list),
        name="portfolios-headers"),
    url(r'^portfolios/(?P<slug>[-\w]+)/$', cache_page(None)(
        views.PortfolioDetail.as_view()),
        name="portfolio-detail"),
    url(r'^portfolios/(?P<slug>[-\w]+)/pictures/$', cache_page(None)(
        views.portfolio_pictures),
        name="portfolio-pictures"),
    url(r'^portfolios/(?P<slug>[-\w]+)/hits/$', cache_page(60 * 3)(
        views.portfolio_hits),
        name="portfolio-hits"),
    url(r'^portfolio-picture/$', cache_page(None)(
        views.PortfolioPictureList.as_view()),
        name="portfolio-picture-list"),
    url(r'^portfolio-picture/portfolio/(?P<portfolio>[-\w]+)/picture/(?P<picture>[0-9A-Fa-f]{40})/$',
        cache_page(None)(views.PortfolioPictureDetail.as_view()),
        name="portfolio-picture-detail"),
]
