from django.conf.urls import url

from stats import views

urlpatterns = [
    url(r'^hits/$', views.HitList.as_view(),
        name="hits-list"),
]
