from django.conf.urls import url

from librairy import views


urlpatterns = [
        url(r'^pictures/$', views.PicturesList.as_view(),
            name="pictures-list"),
        url(r'^pictures/all/$', views.PicturesPkList,
            name="all-pictures-list"),
        url(r'^pictures/(?P<pk>[0-9]+)/$', views.PictureDetail.as_view(),
            name="picture-detail"),
        url(r'^pictures/(?P<pk>[0-9]+)/short/$', views.PictureShortDetail.as_view(),
            name="picture-detail-short"),
        url(r'^pictures/zip-export/$', views.PicturesZipExport.as_view(),
            name="pictures-zip-export"),
        
        url(r'^collections/$', views.CollectionList.as_view(),
            name="collection-list"),
        url(r'^collections/(?P<pk>[0-9]+)/$', views.CollectionDetail.as_view(),
            name="collection-detail"),

        url(r'^collection-picture/$',
            views.CollectionPictureList.as_view(),
            name="collection-picture-list"),
        url(r'^collection-picture/collection/(?P<collection>[0-9]+)/picture/(?P<picture>[0-9]+)/$',
            views.CollectionPictureDetail.as_view(),
            name="collection-picture-detail"),
        
        url(r'^collection-ensembles/$', views.CollectionEnsembleList.as_view(),
            name="collection-ensemble-list"),
        url(r'^collection-ensembles/(?P<pk>[0-9]+)/$',
            views.CollectionEnsembleDetail.as_view(),
            name="collection-ensemble-detail"),
        
        url(r'^collections/headers/$',
            views.collections_headers_list,
            name="collection-headers"),
]
