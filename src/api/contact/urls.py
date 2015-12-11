from django.conf.urls import url

from contact import views

urlpatterns = [
    url(r'^$', views.contact_root,
        name="contact-root"),
    url(r'^description/$', views.LastDescription.as_view(),
        name="contact-description"),
    url(r'^descriptions/$', views.DescriptionList.as_view(),
        name="contact-descriptions-list"),
    url(r'^descriptions/(?P<pk>[0-9]+)/$', views.DescriptionDetail.as_view(),
        name="contact-descriptions-detail"),
    url(r'^messages/$', views.MessageList.as_view(),
        name="contact-messages-list"),
    url(r'^messages/(?P<pk>[0-9]+)/$', views.MessageDetail.as_view(),
        name="contact-messages-detail"),
]
