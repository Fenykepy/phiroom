from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from user.views import user_is_staff
from weblog.views import ListEntrys, ListPortfolios, ListEntrysByTag, \
        ViewEntry, CreateEntry, UpdateEntry, DeleteEntry

urlpatterns = patterns('',
        # weblog home page (list entrys)
        url(r'^$', ListEntrys.as_view(), name="weblog_home"),
        url(r'^page/(?P<page>\d+)/$', ListEntrys.as_view(), name="weblog_home"),
        
        # entry update
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/edit/$',
            user_passes_test(user_is_staff)(UpdateEntry.as_view()),
            name="entry_edit"),

        # entry delete
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/delete/$',
            user_passes_test(user_is_staff)(DeleteEntry.as_view()),
            name="entry_delete"),

        # portfolios list
        url(r'^portfolios/$', ListPortfolios.as_view(),
            name="weblog_portfolios"),
        url(r'^page/(?P<page>\d+)/portfolios/$', ListPortfolios.as_view(),
            name="weblog_portfolios"),

        # entrys by tags
        url(r'^keyword/(?P<slug>.+)/$', ListEntrysByTag.as_view(),
            name="weblog_tag"),
        url(r'^page/(?P<page>\d+)/keyword/(?P<slug>.+)/$',
            ListEntrysByTag.as_view(), name="weblog_tag"),

        # entry view
        url(r'^(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/$',
            ViewEntry.as_view(), name="entry_view"),

        # entry create
        url(r'^create/$',
            user_passes_test(user_is_staff)(CreateEntry.as_view()),
            name="entry_create"),

)

# To get static files during development
urlpatterns += staticfiles_urlpatterns()
