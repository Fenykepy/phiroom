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
]
