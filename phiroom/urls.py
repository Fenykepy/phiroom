#-*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.contrib import admin

from phiroom.feeds import WeblogFeed
from phiroom.sitemaps import WeblogSitemap, TagSitemap, StaticSitemap

admin.autodiscover()

sitemaps = {
        'weblog': WeblogSitemap,
        'tag': TagSitemap,
        'static': StaticSitemap,
}

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls), name="admin"),
    url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap',
        {'sitemaps': sitemaps}),    
    url(r'^$', 'phiroom.views.home', name="home"), # home page
    url(r'^weblog/', include('weblog.urls')), # articles app
    url(r'^portfolio/', include('portfolio.urls')), # portfolio app
    url(r'^librairy/', include('librairy.urls')), # librairy app
    url(r'^settings/', include('conf.urls')), # conf app
    url(r'^account/', include('user.urls')), # user app
    url(r'^contact/', include('contact.urls')), # user app
    #url(r'^comment/', include('comment.urls')), # comment app
    url(r'^feed/$', WeblogFeed(), name="feed"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

