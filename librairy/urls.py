#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from user.views import user_is_staff

#import librairy.views
from librairy.views import *


urlpatterns = patterns('',
    ## librairy home
    url(r'^$', user_passes_test(user_is_staff)(ListPictures.as_view()),
        name="librairy_home"),

    ## pictures managment
    # librairy remove picture form
    url(r'^picture/(?P<pk>\d+)/remove/$',
        user_passes_test(user_is_staff)(RemovePicture.as_view()),
        name="librairy_remove_picture"),
    # ajax picture rating
    url(r'^picture/(?P<id>\d+)/rate/(?P<rate>[0-5])/$',
        user_passes_test(user_is_staff)(RatePicture),
        name="librairy_rate_picture"),

    ## folder managment
    # librairy importation view
    url(r'^folder/import/$',
        user_passes_test(user_is_staff)(ImportPictures.as_view()),
        name="librairy_import"),
    # librairy folder creation view
    url(r'^folder/create/$',
        user_passes_test(user_is_staff)(CreateFolder.as_view()),
        name="librairy_create_folder"),
    # librairy folder renaming view
    url(r'^folder/rename/$',
        user_passes_test(user_is_staff)(RenameFolder.as_view()),
        name="librairy_rename_folder"),
    # librairy folder deleting view
    url(r'^folder/delete/$',
        user_passes_test(user_is_staff)(DeleteFolder.as_view()),
        name="librairy_delete_folder"),
    # librairy folder list view
    url(r'^folder/(?P<pk>\d+)-(?P<slug>[^/].+)/$',
        user_passes_test(user_is_staff)(ListFolder.as_view()),
        name="librairy_folder"),

    ## collection managment
    # librairy collection creation view
    url(r'^collection/create/$',
        user_passes_test(user_is_staff)(CreateCollection.as_view()),
        name="librairy_create_collection"),
    # librairy collection renaming view
    url(r'^collection/rename/$',
        user_passes_test(user_is_staff)(RenameCollection.as_view()),
        name="librairy_rename_collection"),
    # librairy collection deleting view
    url(r'^collection/delete/$',
        user_passes_test(user_is_staff)(DeleteCollection.as_view()),
        name="librairy_delete_collection"),
    # librairy collection's pictures adding view
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/add/$',
        user_passes_test(user_is_staff)(AddPict2Collection),
        name="librairy_add_pict_2_collection"),
    # librairy collection's pictures ordering view
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/order/$',
        user_passes_test(user_is_staff)(AddOrder2Collection),
        name="librairy_add_order_2_collection"),
    # librairy collection's pictures deleting view
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/(?P<pict_pk>\d+)/delete/$',
        user_passes_test(user_is_staff)(DeletePictFromCollection),
        name="librairy_delete_pict_from_collection"),
    # librairy collection list view
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/$',
        user_passes_test(user_is_staff)(ListCollection.as_view()),
        name="librairy_collection"),

    ## collections ensemble managment
    # librairy collections ensemble creation view
    url(r'^collections-ensemble/create/$',
        user_passes_test(user_is_staff)(CreateCollectionsEnsemble.as_view()),
        name="librairy_create_collections_ensemble"),
    # librairy collections ensemble renaming view
    url(r'^collections-ensemble/rename/$',
        user_passes_test(user_is_staff)(RenameCollectionsEnsemble.as_view()),
        name="librairy_rename_collections_ensemble"),
    # librairy collections ensemble deleting view
    url(r'^collections-ensemble/delete/$',
        user_passes_test(user_is_staff)(DeleteCollectionsEnsemble.as_view()),
        name="librairy_delete_collections_ensemble"),
    # librairy collections ensemble list view
    url(r'^collections-ensemble/(?P<pk>\d+)-(?P<slug>[^/].+)/$',
        user_passes_test(user_is_staff)(ListCollectionsEnsemble.as_view()),
        name="librairy_collections_ensemble"),

    ## tag (weblog ones) managment
    # librairy tag creation view
    url(r'^tag/create/$', user_passes_test(user_is_staff)(CreateTag.as_view()),
        name="librairy_create_tag"),
    # librairy tag renaming view
    url(r'^tag/rename/$', user_passes_test(user_is_staff)(RenameTag.as_view()),
        name="librairy_rename_tag"),
    # librairy tag deleting view
    url(r'^tag/delete/$', user_passes_test(user_is_staff)(DeleteTag.as_view()),
        name="librairy_delete_tag"),

    ## weblog posts managment
    # librairy entry updating view
    url(r'^entry/update/$',
        user_passes_test(user_is_staff)(ChooseEntryToUpdate.as_view()),
        name="librairy_choose_update_entry"),
    # librairy entry deleting view
    url(r'^entry/delete/$',
        user_passes_test(user_is_staff)(ChooseEntryToDelete.as_view()),
        name="librairy_choose_delete_entry"),
    # librairy entry's pictures adding view
    url(r'^entry/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/add/$',
        user_passes_test(user_is_staff)(AddPict2Entry),
        name="librairy_add_pict_2_entry"),
    # librairy entry's pictures ordering view
    url(r'^entry/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/order/$',
        user_passes_test(user_is_staff)(AddOrder2Entry),
        name="librairy_add_order_2_entry"),
    # librairy entry's pictures deleting view
    url(r'^entry/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/(?P<pict_pk>\d+)/delete/$',
        user_passes_test(user_is_staff)(DeletePictFromEntry),
        name="librairy_delete_pict_from_entry"),
    # librairy entry list view
    url(r'^entry/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/$',
        user_passes_test(user_is_staff)(ListEntry.as_view()),
        name="librairy_entry"),
    
    ## portfolios managment
    # librairy portfolio updating view
    url(r'^portfolio/update/$',
        user_passes_test(user_is_staff)(ChoosePortfolioToUpdate.as_view()),
        name ="librairy_choose_update_portfolio"),
    # librairy portfolio deleting view
    url(r'^portfolio/delete/$',
        user_passes_test(user_is_staff)(ChoosePortfolioToDelete.as_view()),
        name ="librairy_choose_delete_portfolio"),
    # librairy portfolios's pictures adding view
    url(r'^portfolio/(?P<slug>[-\w]+)/add/$',
        user_passes_test(user_is_staff)(AddPict2Portfolio),
        name="librairy_add_pict_2_portfolio"),
    # librairy portfolio's pictures ordering view
    url(r'^portfolio/(?P<slug>[-\w]+)/order/$',
        user_passes_test(user_is_staff)(AddOrder2Portfolio),
        name="librairy_add_order_2_portfolio"),
    # librairy portfolio's pictures deleting view
    url(r'^portfolio/(?P<slug>[-\w]+)/(?P<pict_pk>\d+)/delete/$',
        user_passes_test(user_is_staff)(DeletePictFromPortfolio),
        name="librairy_delete_pict_from_portfolio"),
    # librairy portfolio list view
    url(r'^portfolio/(?P<slug>[-\w]+)/$',
        user_passes_test(user_is_staff)(ListPortfolio.as_view()),
        name="librairy_portfolio"),

    ## help
    url(r'^help/$',
        user_passes_test(user_is_staff)(HelpTemplateView.as_view()),
        name="help_home"),
    url(r'^help/about/$',
        user_passes_test(user_is_staff)(HelpTemplateView.as_view(
            template_name='help/help_about.html')),
        name="help_about"),
    url(r'^help/tutorial/$',
        user_passes_test(user_is_staff)(HelpTemplateView.as_view()),
        name="help_tutorial"),
    url(r'^help/frequently-asked-questions/$',
            user_passes_test(user_is_staff)(HelpTemplateView.as_view()),
            name="help_faq"),
)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
