from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.contrib import admin

from rest_framework_jwt.views import refresh_jwt_token, obtain_jwt_token, verify_jwt_token
from phiroom.views import api_root


urlpatterns = patterns('',
    ## django admin interface
    url(r'^admin/', include(admin.site.urls)),

    ## drf api
    url('^api/$', api_root,
        name="api-root"),
    url(r'^api/weblog/', include('weblog.urls')), # weblog API
    url(r'^api/portfolio/', include('portfolio.urls')), # portfolio API
    url(r'^api/librairy/', include('librairy.urls')), # librairy API
    url(r'^api/users/', include('user.urls')), # users API
    url(r'^api/settings/', include('conf.urls')), # settings API
    url(r'^api/token-auth/', obtain_jwt_token,
        name='token-auth'),
    url(r'^api/token-refresh/', refresh_jwt_token,
        name='token-refresh'),
    url(r'^api/token-verify/', verify_jwt_token,
        name='token-verify'),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),

)

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

