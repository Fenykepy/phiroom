from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from weblog.views import user_is_staff
from gallery.views import ViewGallery, UpdateGallery, DeleteGallery, CreateGallery

urlpatterns = patterns('',
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/edit/$', user_passes_test(user_is_staff)(UpdateGallery.as_view()), name="gallery_edit"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/delete/$', user_passes_test(user_is_staff)(DeleteGallery.as_view()), name="gallery_delete"),
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/$', ViewGallery.as_view(), name="gallery_view"),
        url(r'^create/$', user_passes_test(user_is_staff)(CreateGallery.as_view()), name="gallery_create"),
)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
