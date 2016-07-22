from django.conf.urls import url

from django.views.decorators.cache import cache_page

from user import views


urlpatterns = [
        url(r'^current/$', cache_page(None)(views.RequestUser.as_view()),
            name="request-user"),
        url(r'^author/(?P<pk>[0-9]+)/$',
            cache_page(None)(views.AuthorDetail.as_view()),
            name="author-detail"),
]

