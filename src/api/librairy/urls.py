from django.conf.urls import url

from librairy import views


urlpatterns = [
        url(r'^pictures/$', views.PicturesList.as_view(),
            name="pictures-list"),
        url(r'^pictures/(?P<pk>[0-9]+)/$', views.PictureDetail.as_view(),
            name="picture-detail"),
        url(r'^pictures/(?P<pk>[0-9]+)/short/$', views.PictureShortDetail.as_view(),
            name="picture-detail-short"),

        url(r'^directories/$', views.DirectoriesList.as_view(),
            name="directories-list"),
        url(r'^directories/(?P<pk>[0-9]+)/$', views.DirectoryDetail.as_view(),
            name="directory-detail"),
        url(r'^directories/(?P<pk>[0-9-]+)/pictures/$', views.DirectoryPicturesList.as_view(),
            name="directory-pictures-list"),
]
