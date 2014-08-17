#-*- coding: utf-8 -*-

import os

from datetime import datetime

from django.views.generic.base import ContextMixin
from django.template.loader import render_to_string
from django.views.generic import ListView, FormView, TemplateView, DeleteView
from django.core.urlresolvers import reverse_lazy, reverse
from django.shortcuts import redirect, render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import Q
from django.template import RequestContext

from librairy.forms import *
from librairy.utils import recursive_import, delete_previews, delete_file
from weblog.models import Tag as Tag_weblog
from librairy.models import Picture, Directory, Tag, Label, Licence, Collection, CollectionsEnsemble, Collection_pictures
from weblog.views import ConfMixin, AjaxableResponseMixin
from phiroom.settings import LIBRAIRY




# librairy context class
class LibrairyMixin(ConfMixin):
    """Mixin to get generic context for librairy pages"""

    page_name = 'librairy'

    def get_context_data(self, **kwargs):
        context = super(LibrairyMixin, self).get_context_data(**kwargs)
        context['folders'] = Directory.objects.all()
        context['collectionsensembles'] = CollectionsEnsemble.objects.all()
        context['collections'] = Collection.objects.filter(ensemble=None) # get root collections for lateral menu
#        context['articles'] = Article.objects.all().order_by('-pub_date')
#        context['gallerys'] = Gallery.objects.all().order_by('-pub_date')
#        context['pictofdays'] = Pictofday.objects.all().order_by('-pub_date')
#        context['portfolios'] = Portfolio.objects.all().order_by('-pub_update')
        context['tags'] = Tag_weblog.objects.all()
        return context

# help context class
class HelpMixin(ConfMixin):
    """Mixin to get generic context for help pages"""
    page_name = 'librairy'

# Help template view
class HelpTemplateView(TemplateView,HelpMixin):
    """TemplateView for help pages"""
    template_name = 'help/help_home.html'

# all pictures list
class ListPictures(ListView,LibrairyMixin):
    """Class to list all pictures of librairy"""
    model = Picture # model to list
    context_object_name = 'pictures' # object name in template
    queryset = Picture.objects.all().order_by('-date_import')[:10]

    def get_context_data(self, **kwargs):
        context = super(ListPictures, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'librairy/librairy_list.html'

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'librairy/librairy_base.html'
        
        else:
            return 'librairy/librairy_list.html'

class ListFolder(ListPictures):
    """Class to list all pictures of a folder"""
    def get_queryset(self):
        # if folder doesn't exists raise 404
        folder = get_object_or_404(Directory, slug=self.kwargs['slug'], id=self.kwargs['pk'])
        return folder.get_directory_pictures()

    def get_context_data(self, **kwargs):
        context = super(ListFolder, self).get_context_data(**kwargs)
        context['folder'] = self.kwargs['pk']
        return context

class ListCollection(ListPictures):
    """Class to list all pictures of a collection"""
    def get_queryset(self):
        # if collection doesn't exists raise 404
        collection = get_object_or_404(Collection, slug=self.kwargs['slug'], id=self.kwargs['pk'])
        # else return queryset
        return collection.get_sorted_pictures

    def get_context_data(self, **kwargs):
        context = super(ListCollection, self).get_context_data(**kwargs)
        context['collection'] = [self.kwargs['pk'], self.kwargs['slug']]
        return context

class ListGallery(ListPictures):
    """Class to list all pictures of a gallery"""
    def get_queryset(self):
        date = self.kwargs['date'].replace("/", "-", 2)
        # if gallery doesn't exists raise 404
        gallery = get_object_or_404(Gallery, slug=self.kwargs['slug'], date__startswith=date)
        # else return queryset
        return gallery.get_sorted_pictures

    def get_context_data(self, **kwargs):
        context = super(ListGallery, self).get_context_data(**kwargs)
        context['gallery'] = [self.kwargs['date'], self.kwargs['slug']]
        return context

class ListPictofday(ListPictures):
    """Class to list all pictures of a gallery"""
    def get_queryset(self):
        # if pictofday doesn't exists raise 404
        date = self.kwargs['date'].replace("/", "-", 2)
        pictofday = get_object_or_404(Pictofday, day_date=date)
        # else return queryset
        return [pictofday.picture]

    def get_context_data(self, **kwargs):
        context = super(ListPictofday, self).get_context_data(**kwargs)
        context['pictofday'] = self.kwargs['date']
        return context

#class ListPortfolio(ListPictures):
#    """Class to list all pictures of a portfolio"""
#    def get_queryset(self):
#        # if gallery doesn't exists raise 404
#        portfolio = get_object_or_404(Portfolio, slug=self.kwargs['slug'])
#        # else return queryset
#        return portfolio.get_sorted_pictures
#
#    def get_context_data(self, **kwargs):
#        context = super(ListPortfolio, self).get_context_data(**kwargs)
#        context['portfolio'] = self.kwargs['slug']
#        return context


class ListCollectionsEnsemble(ListPictures):
    """Class to list all pictures of a collections ensemble"""
    def get_queryset(self):
        # if ensemble doesn't exists raise 404
        ensemble = get_object_or_404(CollectionsEnsemble, slug=self.kwargs['slug'], id=self.kwargs['pk'])

        return ensemble.get_pictures()

# ajax based forms class
class LibrairyFormView(AjaxableResponseMixin, FormView, LibrairyMixin):
    """Base class to have ajax forms with non-ajax fallback"""

    template_name = 'forms/forms_auto.html'
    success_url = reverse_lazy('librairy_home')

    def get_context_data(self, **kwargs):
        context = super(LibrairyFormView, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['cancel_link'] = reverse_lazy('librairy_home')

        return context

    def form_valid(self, form):
        """If form is valid, reload page or left panel"""
        if self.request.is_ajax():
            html = render_to_string('librairy/librairy_left_panel.html', self.get_context_data())
            return self.render_to_json_response({'reload': {'nav#left_panel ul#nav': html}})

        return redirect(self.get_success_url())

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'librairy/librairy_forms.html'
        else:
            return 'forms/forms_auto.html'

# importation form
class ImportPictures(LibrairyFormView):
    """Class to import pictures"""
    def get_context_data(self, **kwargs):
        context = super(ImportPictures, self).get_context_data(**kwargs)
        context['title'] = "Importer un dossier existant"
        context['action'] = reverse_lazy('librairy_import')
        context['button'] = "Sélectionner"
    
        return context

    form_class = ImportForm
    
    def form_valid(self, form):
        """If form is valid, save image data in database"""
        # import pictures in database, regenerate previews and reload metadatas if needed
        # for existing files
        directory = recursive_import(os.path.join(LIBRAIRY,
            form.cleaned_data['folder'].replace("/", "", 1)),
            form.cleaned_data['previews'], form.cleaned_data['metadatas'])
        if directory:
            url =  reverse('librairy_folder', kwargs={'pk': directory.id, 'slug': directory.slug})
        else:
            # imported folder was empty
            url = reverse('librairy_home')
        if self.request.is_ajax():
            return self.render_to_json_response({'redirect': url })

        return redirect(url)

# folder creation form
class CreateFolder(LibrairyFormView):
    """Class to create a new folder in librairy"""
    def get_context_data(self, **kwargs):
        context = super(CreateFolder, self).get_context_data(**kwargs)
        context['title'] = "Créer une nouveau dossier"
        context['action'] = reverse_lazy('librairy_create_folder')
        context['button'] = "Enregistrer"
    
        return context

    form_class = CreateFolderForm


# folder renaming form
class RenameFolder(LibrairyFormView):
    """Class to rename a folder existing in librairy"""
    def get_context_data(self, **kwargs):
        context = super(RenameFolder, self).get_context_data(**kwargs)
        context['title'] = "Renommer un dossier"
        context['action'] = reverse_lazy('librairy_rename_folder')
        context['button'] = "Renommer"

        return context

    form_class = RenameFolderForm

# folder deleting form
class DeleteFolder(LibrairyFormView):
    """Class to delete a folder existing in librairy"""
    def get_context_data(self, **kwargs):
        context = super(DeleteFolder, self).get_context_data(**kwargs)
        context['title'] = "Supprimer un dossier"
        context['action'] = reverse_lazy('librairy_delete_folder')
        context['button'] = "Supprimer"
    
        return context

    form_class = DeleteFolderForm

# collection ensemble creation form
class CreateCollectionsEnsemble(LibrairyFormView):
    """Class to create a new collections ensemble"""
    def get_context_data(self, **kwargs):
        context = super(CreateCollectionsEnsemble, self).get_context_data(**kwargs)
        context['title'] = "Créer un nouvel ensemble de collections"
        context['action'] = reverse_lazy('librairy_create_collections_ensemble')
        context['button'] = "Enregistrer"
    
        return context

    form_class = CreateCollectionsEnsembleForm

# collection ensemble renaming form
class RenameCollectionsEnsemble(LibrairyFormView):
    """Class to rename a collections ensemble"""
    def get_context_data(self, **kwargs):
        context = super(RenameCollectionsEnsemble, self).get_context_data(**kwargs)
        context['title'] = "Renommer un ensemble de collections"
        context['action'] = reverse_lazy('librairy_rename_collections_ensemble')
        context['button'] = "Renommer"

        return context

    form_class = RenameCollectionsEnsembleForm

# collection ensembe deleting form
class DeleteCollectionsEnsemble(LibrairyFormView):
    """Class to delete a collections ensemble"""
    def get_context_data(self, **kwargs):
        context = super(DeleteCollectionsEnsemble, self).get_context_data(**kwargs)
        context['title'] = "Effacer un ensemble de collections"
        context['action'] = reverse_lazy('librairy_delete_collections_ensemble')
        context['button'] = "Effacer"
    
        return context

    form_class = DeleteCollectionsEnsembleForm

# collection creation form
class CreateCollection(LibrairyFormView):
    """Class to create a new collection in librairy"""
    def get_context_data(self, **kwargs):
        context = super(CreateCollection, self).get_context_data(**kwargs)
        context['title'] = "Créer une nouvelle collection"
        context['action'] = reverse_lazy('librairy_create_collection')
        context['button'] = "Enregistrer"
    
        return context

    form_class = CreateCollectionForm

# collection renaming form
class RenameCollection(LibrairyFormView):
    """Class to rename a collection"""
    def get_context_data(self, **kwargs):
        context = super(RenameCollection, self).get_context_data(**kwargs)
        context['title'] = "Renommer une collection"
        context['action'] = reverse_lazy('librairy_rename_collection')
        context['button'] = "Renommer"
    
        return context

    form_class = RenameCollectionForm

# collection deleting form
class DeleteCollection(LibrairyFormView):
    """Class to delete a collection"""
    def get_context_data(self, **kwargs):
        context = super(DeleteCollection, self).get_context_data(**kwargs)
        context['title'] = "Effacer une collection"
        context['action'] = reverse_lazy('librairy_delete_collection')
        context['button'] = "Effacer"
    
        return context

    form_class = DeleteCollectionForm


class CreateTag(LibrairyFormView):
    """Class to create a new tag in librairy."""
    def get_context_data(self, **kwargs):
        context = super(CreateTag, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouveau mot clé'
        context['action'] = reverse_lazy('librairy_create_tag')
        context['button'] = 'Enregistrer'

        return context

    form_class = CreateTagForm


class RenameTag(LibrairyFormView):
    """Class to rename a tag."""
    def get_context_data(self, **kwargs):
        context = super(RenameTag, self).get_context_data(**kwargs)
        context['title'] = 'Renommer un mot clé'
        context['action'] = reverse_lazy('librairy_rename_tag')
        context['button'] = 'Renommer'

        return context

    form_class = RenameTagForm


class DeleteTag(LibrairyFormView):
    """Class to delete a tag."""
    def get_context_data(self, **kwargs):
        context = super(DeleteTag, self).get_context_data(**kwargs)
        context['title'] = 'Effacer un mot clé'
        context['action'] = reverse_lazy('librairy_delete_tag')
        context['button'] = 'Effacer'

        return context

    form_class = DeleteTagForm

# article update choosing form
#class ChooseArticleToUpdate(LibrairyFormView):
#    """Class to choose an article to update"""
#    def get_context_data(self, **kwargs):
#        context = super(ChooseArticleToUpdate, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner l'article à mettre à jour"
#        context['action'] = reverse_lazy('librairy_choose_update_article')
#        context['button'] = "Sélectionner"

 #       return context

#    form_class = ChooseArticleToUpdateForm

#    def form_valid(self, form):
#        """If form is valid, redirect to update form"""
#        article = form.cleaned_data.get('article')
#        url =  reverse('article_edit', kwargs={'date': article.pub_date.strftime("%Y/%m/%d"), 'slug': article.slug})
#        if self.request.is_ajax():
#            return self.render_to_json_response({'loadurl':{'section#popup': url}, 'close': 'False' })

#        return redirect(url)

# article delete choosing form
#class ChooseArticleToDelete(LibrairyFormView):
#    """Class to choose an article to delete"""
#    def get_context_data(self, **kwargs):
#        context = super(ChooseArticleToDelete, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner l'article à supprimer"
#        context['action'] = reverse_lazy('librairy_choose_delete_article')
#        context['button'] = "Supprimer"

#        return context

#    form_class = ChooseArticleToDeleteForm

#    def form_valid(self, form):
#        """If form is valid, load deletingform form"""
#        article = form.cleaned_data.get('article')
#        url =  reverse('article_delete', kwargs={'date': article.pub_date.strftime("%Y/%m/%d"), 'slug': article.slug})
#        if self.request.is_ajax():
#            html = render_to_string('weblog/weblog_delete.html', {
#                'entry': article,
#                'action': url,
#                'title': 'Supprimer un article',
#                'message': 'Êtes vous bien sûr de vouloir supprimer l\'article'
#                }, context_instance=RequestContext(self.request))
#            return self.render_to_json_response({'reload':{'section#popup': html}, 'close': 'False'})

#        return redirect(url)

# gallery update choosing form
#class ChooseGalleryToUpdate(LibrairyFormView):
#    """Class to choose a gallery to update"""
#    def get_context_data(self, **kwargs):
#        context = super(ChooseGalleryToUpdate, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner la galerie à mettre à jour"
#        context['action'] = reverse_lazy('librairy_choose_update_gallery')
#        context['button'] = "Sélectionner"

#        return context

#    form_class = ChooseGalleryToUpdateForm

#    def form_valid(self, form):
#        """If form is valid, redirect to update form"""
#        gallery = form.cleaned_data.get('article')
#        url =  reverse('gallery_edit', kwargs={'date': gallery.pub_date.strftime("%Y/%m/%d"), 'slug': gallery.slug })
#        if self.request.is_ajax():
#            return self.render_to_json_response({'loadurl':{'section#popup': url}, 'close': 'False'})

#        return redirect(url)


# article delet choosing form
#class ChooseGalleryToDelete(LibrairyFormView):
#    """Class to choose a gallery to delete"""
#    def get_context_data(self, **kwargs):
#        context = super(ChooseGalleryToDelete, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner la galerie à supprimer"
#        context['action'] = reverse_lazy('librairy_choose_delete_gallery')
#        context['button'] = "Supprimer"

#        return context

#    form_class = ChooseGalleryToDeleteForm

#    def form_valid(self, form):
#        """If form is valid, load deletingform"""
#        gallery = form.cleaned_data.get('article')
#        url =  reverse('gallery_delete', kwargs={'date': gallery.pub_date.strftime("%Y/%m/%d"), 'slug': gallery.slug})
#        if self.request.is_ajax():
#            html = render_to_string('weblog/weblog_delete.html', {
#                'entry': gallery,
#                'action': url,
#                'title': 'Supprimer une galerie',
#                'message': 'Êtes vous bien sûr de vouloir supprimer la galerie'
#                }, context_instance=RequestContext(self.request))
#            return self.render_to_json_response({'reload':{'section#popup': html}, 'close': 'False'})

#        return redirect(url)


#PortfolioToUpdate(LibrairyFormView):
#    """Class to choose a portfolio to update."""
#    def get_context_data(self, **kwargs):
#        context = super(ChoosePortfolioToUpdate, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner le portfolio à mettre à jour"
#        context['action'] = reverse_lazy('librairy_choose_update_portfolio')
#        context['button'] = "Sélectionner"

#        return context
    
#    form_class = ChoosePortfolioToUpdateForm

#    def form_valid(self, form):
#        """If form is valid, redirect to update form."""
#        portfolio = form.cleaned_data.get('article')
#        url = reverse('portfolio_edit', kwargs={'slug': portfolio.slug })
#        if self.request.is_ajax():
#            return self.render_to_json_response({'loadurl':{'section#popup': url}, 'close': 'False'})
#
#        return redirect(url)


# portfolio delete choosing form
#class ChoosePortfolioToDelete(LibrairyFormView):
#    """Class to choose a portfolio to delete."""
#    def get_context_data(self, **kwargs):
#        context = super(ChoosePortfolioToDelete, self).get_context_data(**kwargs)
#        context['title'] = "Sélectionner le portfolio à supprimer"
#        context['action'] = reverse_lazy('librairy_choose_delete_portfolio')
#        context['button'] = "Supprimer"

#        return context

#    form_class = ChoosePortfolioToDeleteForm

#    def form_valid(self, form):
#        """If form is valid, load deleting form."""
#        portfolio = form.cleaned_data.get('article')
#        url = reverse('portfolio_delete', kwargs={'slug': portfolio.slug})
#        if self.request.is_ajax():
#            html = render_to_string('weblog/weblog_delete.html', {
#                'entry': portfolio,
#                'action': url,
#                'title': 'Supprimer un portfolio',
#                'message': 'Êtes vous bien sûr de vouloir supprimer le portfolio'
#                }, context_instance=RequestContext(self.request))
#            return self.render_to_json_response({'reload':{'section#popup': html}, 'close': 'False'})
#
#        return redirect(url)




# ajax picture adding to collection
def AddPict2Collection(request, pk, slug):
    """Fonction to add a picture to a collection"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        for n in request.POST.getlist('arr'):
            pict = get_object_or_404(Picture, id=int(n))
            try:
                collectionpict = Collection_pictures.objects.get(collection=collection, picture=pict)
            except:
                collectionpict = Collection_pictures(collection=collection, picture=pict)
                collectionpict.save()
        collection.n_pict = collection.pictures.count()
        collection.save()

        return HttpResponse(collection.n_pict)
    return HttpResponse("request_error")

# ajax picture removing from collection
def DeletePictFromCollection(request, pk, slug, pict_pk):
    """Fonction to delete a picture from a collection"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        pict = get_object_or_404(Picture, id=pict_pk)
        try:
            collectionpict = Collection_pictures.objects.get(collection=collection, picture=pict)
            collectionpict.delete()
        except:
            pass
        collection.n_pict = collection.pictures.count()
        collection.save()

        return HttpResponse(collection.n_pict)
    return HttpResponse("request_error")

# ajax ordering for collection
def AddOrder2Collection(request, pk, slug):
    """Fonction to add order to a collection's pictures"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        for i, n in enumerate(request.POST.getlist('arr')):
            try:
                collectionpict = Collection_pictures.objects.get(collection=collection, picture=int(n))
                collectionpict.order = i + 1
                collectionpict.save()
            except:
                pass
        collection.order = 'custom'
        collection.save()

        return HttpResponse("done")
    return HttpResponse("request_error")

# ajax picture adding to gallery
#def AddPict2Gallery(request, date, slug):
#    """Fonction to add a picture to a gallery"""
#    if request.is_ajax():
#        date = date.replace("/", "-", 2)
#        gallery = get_object_or_404(Gallery, slug=slug, pub_date__startswith=date)
#        for n in request.POST.getlist('arr'):
#            pict = get_object_or_404(Picture, id=int(n))
#            try:
#                gallerypict = Gallery_pictures.objects.get(gallery=gallery, picture=pict)
#            except:
#                gallerypict = Gallery_pictures(gallery=gallery, picture=pict)
#                gallerypict.save()
#        gallery.n_pict = gallery.pictures.all().count()
#        if gallery.auto_draft:
#            gallery.auto_draft = False
#        # if it hasn't been publish publish it
#        if not gallery.is_published:
#            gallery.mail_followers()
#        gallery.clear_cache()
#         gallery.save()

#        return HttpResponse(gallery.n_pict)
#    return HttpResponse("request_error")

# ajax ordering for gallerys
#def AddOrder2Gallery(request, date, slug):
#    """Fonction to add order to a gallery's pictures"""
#    if request.is_ajax():
#        date = date.replace("/", "-", 2)
#        gallery = get_object_or_404(Gallery, slug=slug, pub_date__startswith=date)
#        for i, n in enumerate(request.POST.getlist('arr')):
#            try:
#                gallerypict = Gallery_pictures.objects.get(gallery=gallery, picture=int(n))
#                gallerypict.order = i + 1
#                gallerypict.save()
#            except:
#                pass
#        gallery.order = 'custom'
#        gallery.save()

#        return HttpResponse("done")
#    return HttpResponse("request_error")


# ajax picture adding to pictofday
##def AddPict2Pictofday(request, date):
#    """Fonction to add a picture to a pictofday"""
#    if request.is_ajax():
#        date = date.replace("/", "-", 2)
#        pictofday = get_object_or_404(Pictofday, day_date=date)
#        pict = get_object_or_404(Picture, id=int(request.POST.getlist('arr')[0]))
#        if pictofday.picture:
#            # show warning ?
#            pass
#        pictofday.picture = pict
#        if pictofday.auto_draft:
#            pictofday.auto_draft = False
#        # if it hasn't been publish publish it
#        if not pictofday.is_published:
#            pictofday.mail_followers()
#        pictofday.clear_cache()
#        pictofday.save()
#
#        return HttpResponse(1)
#    return HttpResponse("request_error")

# ajax picture adding to portfolio
#def AddPict2Portfolio(request, slug):
#    """Fonction to add a picture to a portfolio"""
#    if request.is_ajax():
#        portfolio = get_object_or_404(Portfolio, slug=slug)
#        for n in request.POST.getlist('arr'):
#            pict = get_object_or_404(Picture, id=int(n))
#            try:
#                portfoliopict = Portfolio_pictures.objects.get(portfolio=portfolio, picture=pict)
#            except:
#                portfoliopict = Portfolio_pictures(portfolio=portfolio, picture=pict)
#                portfoliopict.save()
#        portfolio.n_pict = portfolio.pictures.all().count()
#        # if it's auto_draft, remove it
#        if portfolio.auto_draft:
#            portfolio.auto_draft = False
#        # if it hasn't been publish publish it
#        if not portfolio.is_published:
#            portfolio.mail_followers()
#        portfolio.clear_cache()
#        portfolio.save()
#
#        return HttpResponse(portfolio.n_pict)
#    return HttpResponse("request_error")

# ajax ordering for portfolioss
#def AddOrder2Portfolio(request, slug):
#    """Fonction to add order to a portfolio's pictures"""
#    if request.is_ajax():
#        portfolio = get_object_or_404(Portfolio, slug=slug)
#        for i, n in enumerate(request.POST.getlist('arr')):
#            try:
#                portfoliopict = Portfolio_pictures.objects.get(portfolio=portfolio, picture=int(n))
#                portfoliopict.order = i + 1
#                portfoliopict.save()
#            except:
#                pass
#
#        portfolio.order = 'custom'
#        portfolio.save()
#
#        return HttpResponse("done")
#    return HttpResponse("request_error")

# ajax picture removing from gallery
#def DeletePictFromGallery(request, date, slug, pict_pk):
#    """Fonction to delete a picture from a gallery"""
#    # check if it's ajax request
#    if request.is_ajax():
#        date = date.replace("/", "-", 2)
#        gallery = get_object_or_404(Gallery, slug=slug, pub_date__startswith=date)
#        pict = get_object_or_404(Picture, id=pict_pk)
#        try:
#            gallerypict = Gallery_pictures.objects.get(gallery=gallery, picture=pict)
#            gallerypict.delete()
#        except:
#            pass
#        gallery.n_pict = gallery.pictures.all().count()
#        if gallery.n_pict == 0:
#            gallery.auto_draft = True
#        gallery.clear_cache()
#        gallery.save()

#        return HttpResponse(gallery.n_pict)
#    return HttpResponse("request_error")

# ajax picture removing from portfolio
#def DeletePictFromPortfolio(request, slug, pict_pk):
#    """Fonction to delete a picture from a portfolio"""
#    # check if it's ajax request
#    if request.is_ajax():
#        portfolio = get_object_or_404(Portfolio, slug=slug)
#        pict = get_object_or_404(Picture, id=pict_pk)
#        try:
#            portfoliopict = Portfolio_pictures.objects.get(portfolio=portfolio, picture=pict)
#            portfoliopict.delete()
 #       except:
#            pass
#        portfolio.n_pict = portfolio.pictures.all().count()
#        if portfolio.n_pict == 0:
#            portfolio.auto_draft = True
#        portfolio.clear_cache()
#        portfolio.save()
#
#        return HttpResponse(portfolio.n_pict)
#    return HttpResponse("request_error")


class RemovePicture(DeleteView, LibrairyMixin, AjaxableResponseMixin):
    """Fonction to remove a picture from librairy and hard drive."""
    def get_context_data(self, **kwargs):
        context = super(RemovePicture, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'librairy/librairy_delete_picture.html'

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'librairy/librairy_forms.html'
        else:
            return 'librairy/librairy_delete_picture.html'

    def delete(self, request, *args, **kwargs):
        """Delete object from database and hard drive and return response"""
        # get object
        self.object = self.get_object()
        self.id = self.object.id
        # delete previews
        delete_previews(self.object.id)
        # delete original file
        delete_file(self.object)
        # delete from database
        self.object.delete()

        # return response
        if self.request.is_ajax():
            html = html = render_to_string('librairy/librairy_left_panel.html', self.get_context_data())
            return self.render_to_json_response({'reload': {'nav#left_panel ul#nav': html}, 'delete': {'article#' + str(self.id): 'delete'}})

        return redirect(self.get_success_url())

    model = Picture
    success_url = reverse_lazy('librairy_home')

# ajax rating
def RatePicture(request, id, rate):
	"""Fonction to rate picture"""
	# check if it's ajax request
	if request.is_ajax():
		# selecting picture
		pict = Picture.objects.get(id = id)
		# if picture exists
		if pict:
			pict.note = int(rate)
			pict.save()
			return render(request, 'librairy/librairy_note.html', {'picture': pict})
		else:
			return HttpResponse("Pict_error")
	return HttpResponse("request_error")

