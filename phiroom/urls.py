from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers
from weblog.views import *
from user.views import *
from librairy.views import *

router = routers.DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'tags', TagViewSet)
router.register(r'users', UserViewSet)
router.register(r'pictures', PictureViewSet)
router.register(r'directorys', DirectoryViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'collectionsEnsembles', CollectionsEnsembleViewSet)
router.register(r'picturesTags', PicturesTagViewSet)


urlpatterns = patterns('',
    ## django admin interface
    url(r'^admin/', include(admin.site.urls)),

    ## drf api
    url('^api/posts-by-tag/(?P<slug>[-\w]+)/$', PostsListByTag.as_view()),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)

if settings.DEBUG:
    urlpatterns += patterns(
            'django.contrib.staticfiles.views',
            url(r'^weblog/', 'serve', kwargs={'path': 'weblog_index.html'}),
    )
