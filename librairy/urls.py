#-*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.decorators import user_passes_test

from weblog.views import user_is_staff

#import librairy.views
from librairy.views import *


urlpatterns = patterns('',
    # librairy home
    url(r'^$', user_passes_test(user_is_staff)(ListPictures.as_view()), name="librairy_home"), # librairy home page (all pictures)(last 100 pictures)
    # pictures managment
    url(r'^picture/(?P<pk>\d+)/remove/$', user_passes_test(user_is_staff)(RemovePicture.as_view()), name="librairy_remove_picture"), # librairy remove picture form
    url(r'^picture/(?P<id>\d+)/rate/(?P<rate>[0-5])/$', user_passes_test(user_is_staff)(RatePicture), name="librairy_rate_picture"), # ajax picture rating
    # folder managment
    url(r'^folder/import/$', user_passes_test(user_is_staff)(ImportPictures.as_view()), name="librairy_import"), # librairy importation form
    url(r'^folder/create/$', user_passes_test(user_is_staff)(CreateFolder.as_view()), name="librairy_create_folder"), # librairy folder creation form
    url(r'^folder/rename/$', user_passes_test(user_is_staff)(RenameFolder.as_view()), name="librairy_rename_folder"), # librairy folder creation form
    url(r'^folder/delete/$', user_passes_test(user_is_staff)(DeleteFolder.as_view()), name="librairy_delete_folder"), # librairy folder creation form
    url(r'^folder/(?P<pk>\d+)-(?P<slug>[^/].+)/$', user_passes_test(user_is_staff)(ListFolder.as_view()), name="librairy_folder"), # librairy folder page
    # collection managment
    url(r'^collection/create/$', user_passes_test(user_is_staff)(CreateCollection.as_view()), name="librairy_create_collection"), # librairy collection page
    url(r'^collection/rename/$', user_passes_test(user_is_staff)(RenameCollection.as_view()), name="librairy_rename_collection"), # librairy collection page
    url(r'^collection/delete/$', user_passes_test(user_is_staff)(DeleteCollection.as_view()), name="librairy_delete_collection"), # librairy collection page
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/add/$', user_passes_test(user_is_staff)(AddPict2Collection), name="librairy_add_pict_2_collection"), # ajax add pictures to collection
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/order/$', user_passes_test(user_is_staff)(AddOrder2Collection), name="librairy_add_order_2_collection"), # ajax add order to collection
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/(?P<pict_pk>\d+)/delete/$', user_passes_test(user_is_staff)(DeletePictFromCollection), name="librairy_delete_pict_from_collection"), # ajax delete picture from collection
    url(r'^collection/(?P<pk>\d+)-(?P<slug>[^/].+)/$', user_passes_test(user_is_staff)(ListCollection.as_view()), name="librairy_collection"), # librairy collection page
    # collections ensemble managment
    url(r'^collections-ensemble/create/$', user_passes_test(user_is_staff)(CreateCollectionsEnsemble.as_view()), name="librairy_create_collections_ensemble"), # librairy collection page
    url(r'^collections-ensemble/rename/$', user_passes_test(user_is_staff)(RenameCollectionsEnsemble.as_view()), name="librairy_rename_collections_ensemble"), # librairy collection page
    url(r'^collections-ensemble/delete/$', user_passes_test(user_is_staff)(DeleteCollectionsEnsemble.as_view()), name="librairy_delete_collections_ensemble"), # librairy collection page
    url(r'^collections-ensemble/(?P<pk>\d+)-(?P<slug>[^/].+)/$', user_passes_test(user_is_staff)(ListCollectionsEnsemble.as_view()), name="librairy_collections_ensemble"), # librairy collection page
    # category managment
    url(r'^category/create/$', user_passes_test(user_is_staff)(CreateCategory.as_view()), name="librairy_create_category"), # librairy category page
    url(r'^category/rename/$', user_passes_test(user_is_staff)(RenameCategory.as_view()), name="librairy_rename_category"), # librairy category page
    url(r'^category/delete/$', user_passes_test(user_is_staff)(DeleteCategory.as_view()), name="librairy_delete_category"), # librairy category page
    # tag (weblog ones) managment
    url(r'^tag/create/$', user_passes_test(user_is_staff)(CreateTag.as_view()), name="librairy_create_tag"), # librairy tag page
    url(r'^tag/rename/$', user_passes_test(user_is_staff)(RenameTag.as_view()), name="librairy_rename_tag"), # librairy tag page
    url(r'^tag/delete/$', user_passes_test(user_is_staff)(DeleteTag.as_view()), name="librairy_delete_tag"), # librairy tag page
    # articles managment
    url(r'^article/update/$', user_passes_test(user_is_staff)(ChooseArticleToUpdate.as_view()), name="librairy_choose_update_article"), # choose article to update
    url(r'^article/delete/$', user_passes_test(user_is_staff)(ChooseArticleToDelete.as_view()), name="librairy_choose_delete_article"), # choose article to delete
    # gallerys managment
    url(r'^gallery/update/$', user_passes_test(user_is_staff)(ChooseGalleryToUpdate.as_view()), name="librairy_choose_update_gallery"), # choose gallery to update
    url(r'^gallery/delete/$', user_passes_test(user_is_staff)(ChooseGalleryToDelete.as_view()), name="librairy_choose_delete_gallery"), # choose gallery to delete
    url(r'^gallery/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/add/$', user_passes_test(user_is_staff)(AddPict2Gallery), name="librairy_add_pict_2_gallery"), # ajax add picture to gallery
    url(r'^gallery/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/order/$', user_passes_test(user_is_staff)(AddOrder2Gallery), name="librairy_add_order_2_gallery"), # ajax add order to gallery
    url(r'^gallery/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/(?P<pict_pk>\d+)/delete/$', user_passes_test(user_is_staff)(DeletePictFromGallery), name="librairy_delete_pict_from_gallery"), # ajax delete picture from gallery
    url(r'^gallery/(?P<date>\d{4}/\d{2}/\d{2})/(?P<slug>[-\w]+)/$', user_passes_test(user_is_staff)(ListGallery.as_view()), name="librairy_gallery"), # librairy gallery page
    # pictofdays managment
    url(r'^pictofday/update/$', user_passes_test(user_is_staff)(ChoosePictofdayToUpdate.as_view()), name="librairy_choose_update_pictofday"), # choose pictofday to update
    url(r'^pictofday/delete/$', user_passes_test(user_is_staff)(ChoosePictofdayToDelete.as_view()), name="librairy_choose_delete_pictofday"), # choose pictofday to delete
    url(r'^pictofday/(?P<date>\d{4}/\d{2}/\d{2})/add/$', user_passes_test(user_is_staff)(AddPict2Pictofday), name="librairy_add_pict_2_pictofday"), # librairy picture of day page
    url(r'^pictofday/(?P<date>\d{4}/\d{2}/\d{2})/$', user_passes_test(user_is_staff)(ListPictofday.as_view()), name="librairy_pictofday"), # librairy picture of day page
    # portfolios managment
    url(r'^portfolio/update/$', user_passes_test(user_is_staff)(ChoosePortfolioToUpdate.as_view()), name ="librairy_choose_update_portfolio"),
    url(r'^portfolio/delete/$', user_passes_test(user_is_staff)(ChoosePortfolioToDelete.as_view()), name ="librairy_choose_delete_portfolio"),
    url(r'^portfolio/(?P<slug>[-\w]+)/$', user_passes_test(user_is_staff)(ListPortfolio.as_view()), name="librairy_portfolio"), # librairy portfolio page
    url(r'^portfolio/(?P<slug>[-\w]+)/add/$', user_passes_test(user_is_staff)(AddPict2Portfolio), name="librairy_add_pict_2_portfolio"), # ajax add picture to portfolio
    url(r'^portfolio/(?P<slug>[-\w]+)/order/$', user_passes_test(user_is_staff)(AddOrder2Portfolio), name="librairy_add_order_2_portfolio"), # ajax add order to portfolio
    url(r'^portfolio/(?P<slug>[-\w]+)/(?P<pict_pk>\d+)/delete/$', user_passes_test(user_is_staff)(DeletePictFromPortfolio), name="librairy_delete_pict_from_portfolio"), # ajax delete picture from portfolio
    # help
    url(r'^help/$', user_passes_test(user_is_staff)(HelpTemplateView.as_view()), name="help_home"), # help home page
    url(r'^help/about/$', user_passes_test(user_is_staff)(HelpTemplateView.as_view(template_name='help/help_about.html')), name="help_about"), # help phiroom about
    url(r'^help/tutorial/$', user_passes_test(user_is_staff)(HelpTemplateView.as_view()), name="help_tutorial"), # help phiroom about
    url(r'^help/frequently-asked-questions/$', user_passes_test(user_is_staff)(HelpTemplateView.as_view()), name="help_faq"), # help phiroom about
)


# To get static files during development
urlpatterns += staticfiles_urlpatterns()
