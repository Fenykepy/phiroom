from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin

from phiroom.views import api_root


urlpatterns = patterns('',
    ## django admin interface
    url(r'^admin/', include(admin.site.urls)),

    ## drf api
    url('^api/$', api_root),
    url(r'^api/librairy/', include('librairy.urls')), # librairy API
    url(r'^api/users/', include('user.urls')), # users API
    url(r'^api/settings/', include('conf.urls')), # settings API
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)

if settings.DEBUG:
    urlpatterns += patterns(
            # serve angularjs root template
            'django.contrib.staticfiles.views',
            url(r'^', 'serve', kwargs={'path': 'index.html'}),
    )
