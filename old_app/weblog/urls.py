from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from weblog.views import *

urlpatterns = patterns('',
        # weblog home page
        url(r'^$', ListEntrys.as_view(), name="weblog_home"),
        url(r'^page/(?P<page>\d+)/$', ListEntrys.as_view(), name="weblog_home"),
        # articles list
        url(r'^articles/$', ListArticles.as_view(), name="weblog_articles"),
        url(r'^page/(?P<page>\d+)/articles/$', ListArticles.as_view(), name="weblog_articles"),
        # gallerys list
        url(r'^gallerys/$', ListGallerys.as_view(), name="weblog_gallerys"),
        url(r'^page/(?P<page>\d+)/gallerys/$', ListGallerys.as_view(), name="weblog_gallerys"),
        # portfolios list
        url(r'^portfolios/$', ListPortfolios.as_view(), name="weblog_portfolios"),
        url(r'^page/(?P<page>\d+)/portfolios/$', ListPortfolios.as_view(), name="weblog_portfolios"),
        # pictofdays list
        url(r'^picturesofday/$', ListPictofdays.as_view(), name="weblog_pictofdays"),
        url(r'^page/(?P<page>\d+)/picturesofday/$', ListPictofdays.as_view(), name="weblog_pictofdays"),
        # entrys by categorys
        url(r'^category/(?P<pk>\d+)-(?P<cat>.+)/$', ListEntrysByCat.as_view(), name="weblog_cat"),
        url(r'^page/(?P<page>\d+)/category/(?P<pk>\d+)-(?P<cat>.+)/$', ListEntrysByCat.as_view(), name="weblog_cat"),
        # entrys by tags
        url(r'^keyword/(?P<slug>.+)/$', ListEntrysByTag.as_view(), name="weblog_tag"),
        url(r'^page/(?P<page>\d+)/keyword/(?P<slug>.+)/$', ListEntrysByTag.as_view(), name="weblog_tag"),
        # entrys by picture
        url(r'^picture/(?P<pk>\d+)/$', ListEntrysByPicture.as_view(), name="weblog_picture"),
        url(r'^page/(?P<page>\d+)/picture/(?P<pk>\d+)/$', ListEntrysByPicture.as_view(), name="weblog_picture"),
        # entrys by gallerys for a picture
        url(r'^gallery/picture/(?P<pk>\d+)/$', ListEntrysByGallerysPicture.as_view(), name="weblog_picture_gallerys"),
        url(r'^page/(?P<page>\d+)/gallery/picture/(?P<pk>\d+)/$', ListEntrysByGallerysPicture.as_view(), name="weblog_picture_gallerys"),
        # entrys by portfolio for a picture
        url(r'^portfolio/picture/(?P<pk>\d+)/$', ListEntrysByPortfoliosPicture.as_view(), name="weblog_picture_portfolios"),
        url(r'^page/(?P<page>\d+)/portfolio/picture/(?P<pk>\d+)/$', ListEntrysByPortfoliosPicture.as_view(), name="weblog_picture_portfolios"),
        # entrys by year
        url(r'^archive/(?P<year>\d{4})/$', ListEntrysByYear.as_view(), name="weblog_year"),
        url(r'^page/(?P<page>\d+)/archive/(?P<year>\d{4})/$', ListEntrysByYear.as_view(), name="weblog_year"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
