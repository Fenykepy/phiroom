from django.conf.urls import url

from django.views.decorators.cache import cache_page

from librairy import views


urlpatterns = [
        url(r'^pictures/$', cache_page(None)(views.PicturesList.as_view()),
            name="pictures-list"),
        url(r'^pictures/all/$', cache_page(None)(views.PicturesPkList),
            name="all-pictures-list"),
        url(r'^pictures/(?P<sha1>[0-9A-Fa-f]{40})/$', cache_page(None)(
            views.PictureDetail.as_view()),
            name="picture-detail"),
        url(r'^pictures/(?P<sha1>[0-9A-Fa-f]{40})/short/$', cache_page(None)(
            views.PictureShortDetail.as_view()),
            name="picture-detail-short"),
        url(r'^pictures/(?P<sha1>[0-9A-Fa-f]{40})/hits/$', cache_page(60 * 3)(
            views.picture_hits),
            name="picture-hits"),
        url(r'^pictures/zip-export/$', cache_page(None)(
            views.PicturesZipExport.as_view()),
            name="pictures-zip-export"),
        
        url(r'^collections/$', cache_page(None)(views.CollectionList.as_view()),
            name="collection-list"),
        url(r'^collections/(?P<pk>[0-9]+)/$', cache_page(None)(
            views.CollectionDetail.as_view()),
            name="collection-detail"),
        url(r'^collections/(?P<pk>[0-9]+)/pictures/$', cache_page(None)(
            views.collection_pictures),
            name="collection-pictures"),

        url(r'^collection-picture/$',
            cache_page(None)(views.CollectionPictureList.as_view()),
            name="collection-picture-list"),
        url(r'^collection-picture/collection/(?P<collection>[0-9]+)/picture/(?P<picture>[0-9A-Fa-f]{40})/$',
            cache_page(None)(views.CollectionPictureDetail.as_view()),
            name="collection-picture-detail"),
        
        url(r'^collection-ensembles/$', cache_page(None)(
            views.CollectionEnsembleList.as_view()),
            name="collection-ensemble-list"),
        url(r'^collection-ensembles/(?P<pk>[0-9]+)/$',
            cache_page(None)(views.CollectionEnsembleDetail.as_view()),
            name="collection-ensemble-detail"),
        url(r'^collection-ensembles/(?P<pk>[0-9]+)/pictures/$',
            cache_page(None)(views.collections_ensemble_pictures),
            name="collection-ensemble-pictures"),
        
        url(r'^collections/headers/$',
            cache_page(None)(views.collections_headers_list),
            name="collection-headers"),
]
