#-*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.contrib import admin

from phiroom.feeds import WeblogFeed
from phiroom.sitemaps import WeblogSitemap, TagSitemap, StaticSitemap
from user.views import LoginView, RegistrationView, ProfilView

admin.autodiscover()

sitemaps = {
        'weblog': WeblogSitemap,
        'tag': TagSitemap,
        'static': StaticSitemap,
}

handler404 = 'phiroom.views.error404'
handler500 = 'phiroom.views.error500'
handler403 = 'phiroom.views.error403'
handler400 = 'phiroom.views.error400'

urlpatterns = patterns('',
    ## uncomment to test error pages
    #url(r'^404', 'phiroom.views.error404', name="404"),
    #url(r'^500', 'phiroom.views.error500', name="500"),
    #url(r'^403', 'phiroom.views.error403', name="403"),
    #url(r'^400', 'phiroom.views.error400', name="400"),


    url(r'^admin/', include(admin.site.urls), name="admin"),
    url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap',
        {'sitemaps': sitemaps}),    
    url(r'^$', 'phiroom.views.home', name="home"), # home page
    url(r'^weblog/', include('weblog.urls')), # articles app
    url(r'^portfolio/', include('portfolio.urls')), # portfolio app
    url(r'^librairy/', include('librairy.urls')), # librairy app
    url(r'^settings/', include('conf.urls')), # conf app
    url(r'^contact/', include('contact.urls')), # user app
    #url(r'^comment/', include('comment.urls')), # comment app
    url(r'^feed/$', WeblogFeed(), name="feed"),
    url(r'^login/$', LoginView.as_view(), name="user_login"),
    url(r'^logout/$', 'user.views.logout_view', name="user_logout"),
    url(r'^register/$', RegistrationView.as_view(), name="user_registration"),
    url(r'^profil/$', login_required(ProfilView.as_view()), name="user_profil"),
    #url(r'^recovery/$', RecoveryView.as_view(), name="user_recovery"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

