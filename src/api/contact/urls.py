from django.conf.urls import url

from contact import views

urlpatterns = [
    url(r'^$', views.contact_root,
        name="contact-root"),
    url(r'^description/$', views.LastDescription.as_view(),
        name="contact-description"),
]
