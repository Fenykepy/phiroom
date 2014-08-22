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
from weblog.models import Tag as Tag_weblog, Entry, Entry_pictures
from librairy.models import Picture, Directory, Tag, Label, Licence, Collection, CollectionsEnsemble, Collection_pictures
from weblog.views import ConfMixin, AjaxableResponseMixin
from phiroom.settings import LIBRAIRY



class LibrairyMixin(ConfMixin):
    """Mixin to get generic context for librairy pages"""
    page_name = 'librairy'

    def get_context_data(self, **kwargs):
        context = super(LibrairyMixin, self).get_context_data(**kwargs)
        context['folders'] = Directory.objects.all()
        context['collectionsensembles'] = CollectionsEnsemble.objects.all()
        # get root collections for lateral menu
        context['collections'] = Collection.objects.filter(ensemble=None)
        context['posts'] = Entry.posts.all()
        context['portfolios'] = Entry.portfolios.all()
        context['tags'] = Tag_weblog.objects.all()

        return context



class HelpMixin(ConfMixin):
    """Mixin to get generic context for help pages"""
    page_name = 'librairy'



class HelpTemplateView(TemplateView,HelpMixin):
    """TemplateView for help pages"""
    template_name = 'help/help_home.html'



class ListPictures(ListView,LibrairyMixin):
    """Class to list all pictures of librairy"""
    model = Picture # model to list
    context_object_name = 'pictures' # object name in template
    queryset = Picture.objects.all().order_by('-date_import')[:100]

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
        folder = get_object_or_404(Directory, slug=self.kwargs['slug'],
                id=self.kwargs['pk'])

        return folder.get_directory_pictures()


    def get_context_data(self, **kwargs):
        context = super(ListFolder, self).get_context_data(**kwargs)
        context['folder'] = self.kwargs['pk']

        return context



class ListCollection(ListPictures):
    """Class to list all pictures of a collection"""
    def get_queryset(self):
        # if collection doesn't exists raise 404
        collection = get_object_or_404(Collection, slug=self.kwargs['slug'],
                id=self.kwargs['pk'])
        
        return collection.get_sorted_pictures


    def get_context_data(self, **kwargs):
        context = super(ListCollection, self).get_context_data(**kwargs)
        context['collection'] = [self.kwargs['pk'], self.kwargs['slug']]

        return context



class ListPost(ListPictures):
    """Class to list all pictures of a blog post entry"""
    def get_queryset(self):
        date = self.kwargs['date'].replace("/", "-", 2)
        # if entry doesn't exists raise 404
        post = get_object_or_404(Entry, slug=self.kwargs['slug'],
                date__startswith=date)

        return post.get_sorted_pictures_full


    def get_context_data(self, **kwargs):
        context = super(ListPost, self).get_context_data(**kwargs)
        context['post'] = [self.kwargs['date'], self.kwargs['slug']]
        return context



class ListPortfolio(ListPictures):
    """Class to list all pictures of a portfolio"""
    def get_queryset(self):
        # if entry doesn't exists raise 404
        portfolio = get_object_or_404(Entry,
                portfolio=True,
                slug=self.kwargs['slug'])

        return portfolio.get_sorted_pictures_full


    def get_context_data(self, **kwargs):
        context = super(ListPortfolio, self).get_context_data(**kwargs)
        context['portfolio'] = self.kwargs['slug']
        return context



class ListCollectionsEnsemble(ListPictures):
    """Class to list all pictures of a collections ensemble"""
    def get_queryset(self):
        # if ensemble doesn't exists raise 404
        ensemble = get_object_or_404(CollectionsEnsemble,
                slug=self.kwargs['slug'], id=self.kwargs['pk'])

        return ensemble.get_pictures()



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
            html = render_to_string('librairy/librairy_left_panel.html',
                    self.get_context_data())

            return self.render_to_json_response({
                'reload': {'nav#left_panel ul#nav': html}})

        return redirect(self.get_success_url())


    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'librairy/librairy_forms.html'
        else:
            return 'forms/forms_auto.html'



class ImportPictures(LibrairyFormView):
    """Class to import pictures"""
    form_class = ImportForm

    def get_context_data(self, **kwargs):
        context = super(ImportPictures, self).get_context_data(**kwargs)
        context['title'] = "Importer un dossier existant"
        context['action'] = reverse_lazy('librairy_import')
        context['button'] = "Sélectionner"
    
        return context

    
    def form_valid(self, form):
        """If form is valid, save image data in database, regenerate
        previews and reload metadatas if needed"""
        # for existing files
        directory = recursive_import(os.path.join(LIBRAIRY,
            form.cleaned_data['folder'].replace("/", "", 1)),
            form.cleaned_data['previews'], form.cleaned_data['metadatas'])
        if directory:
            url =  reverse('librairy_folder',
                    kwargs={'pk': directory.id, 'slug': directory.slug})
        else:
            # imported folder was empty
            url = reverse('librairy_home')
        if self.request.is_ajax():
            return self.render_to_json_response({'redirect': url })

        return redirect(url)



class CreateFolder(LibrairyFormView):
    """Class to create a new folder in librairy"""
    form_class = CreateFolderForm

    def get_context_data(self, **kwargs):
        context = super(CreateFolder, self).get_context_data(**kwargs)
        context['title'] = "Créer une nouveau dossier"
        context['action'] = reverse_lazy('librairy_create_folder')
        context['button'] = "Enregistrer"
    
        return context




class RenameFolder(LibrairyFormView):
    """Class to rename a folder existing in librairy"""
    form_class = RenameFolderForm
    
    def get_context_data(self, **kwargs):
        context = super(RenameFolder, self).get_context_data(**kwargs)
        context['title'] = "Renommer un dossier"
        context['action'] = reverse_lazy('librairy_rename_folder')
        context['button'] = "Renommer"

        return context



class DeleteFolder(LibrairyFormView):
    """Class to delete a folder existing in librairy"""
    form_class = DeleteFolderForm

    def get_context_data(self, **kwargs):
        context = super(DeleteFolder, self).get_context_data(**kwargs)
        context['title'] = "Supprimer un dossier"
        context['action'] = reverse_lazy('librairy_delete_folder')
        context['button'] = "Supprimer"
    
        return context



class CreateCollectionsEnsemble(LibrairyFormView):
    """Class to create a new collections ensemble"""
    form_class = CreateCollectionsEnsembleForm

    def get_context_data(self, **kwargs):
        context = super(CreateCollectionsEnsemble,
                self).get_context_data(**kwargs)
        context['title'] = "Créer un nouvel ensemble de collections"
        context['action'] = reverse_lazy('librairy_create_collections_ensemble')
        context['button'] = "Enregistrer"
    
        return context


class RenameCollectionsEnsemble(LibrairyFormView):
    """Class to rename a collections ensemble"""
    form_class = RenameCollectionsEnsembleForm

    def get_context_data(self, **kwargs):
        context = super(RenameCollectionsEnsemble,
                self).get_context_data(**kwargs)
        context['title'] = "Renommer un ensemble de collections"
        context['action'] = reverse_lazy('librairy_rename_collections_ensemble')
        context['button'] = "Renommer"

        return context



class DeleteCollectionsEnsemble(LibrairyFormView):
    """Class to delete a collections ensemble"""
    form_class = DeleteCollectionsEnsembleForm

    def get_context_data(self, **kwargs):
        context = super(DeleteCollectionsEnsemble,
                self).get_context_data(**kwargs)
        context['title'] = "Effacer un ensemble de collections"
        context['action'] = reverse_lazy('librairy_delete_collections_ensemble')
        context['button'] = "Effacer"
    
        return context



class CreateCollection(LibrairyFormView):
    """Class to create a new collection in librairy"""
    form_class = CreateCollectionForm

    def get_context_data(self, **kwargs):
        context = super(CreateCollection, self).get_context_data(**kwargs)
        context['title'] = "Créer une nouvelle collection"
        context['action'] = reverse_lazy('librairy_create_collection')
        context['button'] = "Enregistrer"
    
        return context


class RenameCollection(LibrairyFormView):
    """Class to rename a collection"""
    form_class = RenameCollectionForm

    def get_context_data(self, **kwargs):
        context = super(RenameCollection, self).get_context_data(**kwargs)
        context['title'] = "Renommer une collection"
        context['action'] = reverse_lazy('librairy_rename_collection')
        context['button'] = "Renommer"
    
        return context



class DeleteCollection(LibrairyFormView):
    """Class to delete a collection"""
    form_class = DeleteCollectionForm

    def get_context_data(self, **kwargs):
        context = super(DeleteCollection, self).get_context_data(**kwargs)
        context['title'] = "Effacer une collection"
        context['action'] = reverse_lazy('librairy_delete_collection')
        context['button'] = "Effacer"
    
        return context



class CreateTag(LibrairyFormView):
    """Class to create a new tag in librairy."""
    form_class = CreateTagForm
    
    def get_context_data(self, **kwargs):
        context = super(CreateTag, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouveau mot clé'
        context['action'] = reverse_lazy('librairy_create_tag')
        context['button'] = 'Enregistrer'

        return context



class RenameTag(LibrairyFormView):
    """Class to rename a tag."""
    form_class = RenameTagForm

    def get_context_data(self, **kwargs):
        context = super(RenameTag, self).get_context_data(**kwargs)
        context['title'] = 'Renommer un mot clé'
        context['action'] = reverse_lazy('librairy_rename_tag')
        context['button'] = 'Renommer'

        return context



class DeleteTag(LibrairyFormView):
    """Class to delete a tag."""
    form_class = DeleteTagForm

    def get_context_data(self, **kwargs):
        context = super(DeleteTag, self).get_context_data(**kwargs)
        context['title'] = 'Effacer un mot clé'
        context['action'] = reverse_lazy('librairy_delete_tag')
        context['button'] = 'Effacer'

        return context



class ChoosePostToUpdate(LibrairyFormView):
    """Class to choose an entry to update"""
    form_class = ChoosePostToUpdateForm

    def get_context_data(self, **kwargs):
        context = super(ChoosePostToUpdate, self).get_context_data(**kwargs)
        context['title'] = "Sélectionner le post à mettre à jour"
        context['action'] = reverse_lazy('librairy_choose_update_entry')
        context['button'] = "Sélectionner"

        return context


    def form_valid(self, form):
        """If form is valid, redirect to update form"""
        entry = form.cleaned_data.get('entry')
        url =  reverse('entry_edit', kwargs={
            'date': entry.pub_date.strftime("%Y/%m/%d"),
            'slug': entry.slug })
        if self.request.is_ajax():
            return self.render_to_json_response({
                'loadurl':{'section#popup': url},
                'close': 'False'})

        return redirect(url)



class ChoosePostToDelete(LibrairyFormView):
    """Class to choose an entry to delete"""
    form_class = ChoosePostToDeleteForm

    def get_context_data(self, **kwargs):
        context = super(ChoosePostToDelete, self).get_context_data(**kwargs)
        context['title'] = "Sélectionner le post à supprimer"
        context['action'] = reverse_lazy('librairy_choose_delete_entry')
        context['button'] = "Supprimer"

        return context


    def form_valid(self, form):
        """If form is valid, load deletingform"""
        entry = form.cleaned_data.get('entry')
        url =  reverse('entry_delete', kwargs={
            'date': entry.pub_date.strftime("%Y/%m/%d"),
            'slug': entry.slug})
        if self.request.is_ajax():
            html = render_to_string('weblog/weblog_delete.html', {
                'entry': entry,
                'action': url,
                'title': 'Supprimer un post',
                'message': 'Êtes vous bien sûr de vouloir supprimer le post'
                }, context_instance=RequestContext(self.request))
            return self.render_to_json_response({
                'reload':{'section#popup': html},
                'close': 'False'})

        return redirect(url)



class ChoosePortfolioToUpdate(LibrairyFormView):
    """Class to choose a portfolio to update."""
    form_class = ChoosePortfolioToUpdateForm

    def get_context_data(self, **kwargs):
        context = super(ChoosePortfolioToUpdate, self).get_context_data(**kwargs)
        context['title'] = "Sélectionner le portfolio à mettre à jour"
        context['action'] = reverse_lazy('librairy_choose_update_portfolio')
        context['button'] = "Sélectionner"

        return context
    

    def form_valid(self, form):
        """If form is valid, redirect to update form."""
        portfolio = form.cleaned_data.get('entry')
        url = reverse('portfolio_edit', kwargs={'slug': portfolio.slug })
        if self.request.is_ajax():
            return self.render_to_json_response({
                'loadurl':{'section#popup': url},
                'close': 'False'})

        return redirect(url)



class ChoosePortfolioToDelete(LibrairyFormView):
    """Class to choose a portfolio to delete."""
    form_class = ChoosePortfolioToDeleteForm

    def get_context_data(self, **kwargs):
        context = super(ChoosePortfolioToDelete, self).get_context_data(**kwargs)
        context['title'] = "Sélectionner le portfolio à supprimer"
        context['action'] = reverse_lazy('librairy_choose_delete_portfolio')
        context['button'] = "Supprimer"

        return context


    def form_valid(self, form):
        """If form is valid, load deleting form."""
        portfolio = form.cleaned_data.get('entry')
        url = reverse('portfolio_delete', kwargs={'slug': portfolio.slug})
        if self.request.is_ajax():
            html = render_to_string('weblog/weblog_delete.html', {
                'entry': portfolio,
                'action': url,
                'title': 'Supprimer un portfolio',
                'message': 'Êtes vous bien sûr de vouloir supprimer le portfolio'
                }, context_instance=RequestContext(self.request))
            return self.render_to_json_response({
                'reload':{'section#popup': html},
                'close': 'False'})

        return redirect(url)



def AddPict2Collection(request, pk, slug):
    """Fonction to add a picture to a collection"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        for n in request.POST.getlist('arr'):
            pict = get_object_or_404(Picture, id=int(n))
            try:
                collectionpict = Collection_pictures.objects.get(
                        collection=collection,
                        picture=pict)
            except:
                collectionpict = Collection_pictures(
                        collection=collection,
                        picture=pict)
                collectionpict.save()
        collection.n_pict = collection.pictures.count()
        collection.save()

        return HttpResponse(collection.n_pict)
    return HttpResponse("request_error")



def DeletePictFromCollection(request, pk, slug, pict_pk):
    """Fonction to delete a picture from a collection"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        pict = get_object_or_404(Picture, id=pict_pk)
        try:
            collectionpict = Collection_pictures.objects.get(
                    collection=collection,
                    picture=pict)
            collectionpict.delete()
        except:
            pass
        collection.n_pict = collection.pictures.count()
        collection.save()

        return HttpResponse(collection.n_pict)
    return HttpResponse("request_error")



def AddOrder2Collection(request, pk, slug):
    """Fonction to add order to a collection's pictures"""
    if request.is_ajax():
        collection = get_object_or_404(Collection, slug=slug, id=pk)
        for i, n in enumerate(request.POST.getlist('arr')):
            try:
                collectionpict = Collection_pictures.objects.get(
                        collection=collection,
                        picture=int(n))
                collectionpict.order = i + 1
                collectionpict.save()
            except:
                pass
        collection.order = 'custom'
        collection.save()

        return HttpResponse("done")
    return HttpResponse("request_error")



def AddPict2Post(request, date, slug):
    """Fonction to add a picture to a entry"""
    if request.is_ajax():
        date = date.replace("/", "-", 2)
        entry = get_object_or_404(Entry, slug=slug, pub_date__startswith=date,
                portfolio=False)
        for n in request.POST.getlist('arr'):
            pict = get_object_or_404(Picture, id=int(n))
            try:
                entrypict = Entry_pictures.objects.get(entry=entry, picture=pict)
            except:
                entrypict = Entry_pictures(entry=entry, picture=pict)
                entrypict.save()
        entry.n_pict = entry.pictures.all().count()
        if entry.auto_draft:
            entry.auto_draft = False
        # if it hasn't been publish publish it
        if not entry.is_published:
            entry.mail_followers()
        entry.clear_cache()
        entry.save()

        return HttpResponse(entry.n_pict)
    return HttpResponse("request_error")



def AddOrder2Post(request, date, slug):
    """Fonction to add order to a entry's pictures"""
    if request.is_ajax():
        date = date.replace("/", "-", 2)
        entry = get_object_or_404(Entry, slug=slug, pub_date__startswith=date,
                portfolio=False)
        for i, n in enumerate(request.POST.getlist('arr')):
            try:
                entrypict = Entry_pictures.objects.get(
                        entry=entry,
                        picture=int(n))
                entrypict.order = i + 1
                entrypict.save()
            except:
                pass
        entry.order = 'custom'
        entry.reversed_order = False
        entry.save()

        return HttpResponse("done")
    return HttpResponse("request_error")



def AddPict2Portfolio(request, slug):
    """Fonction to add a picture to a portfolio"""
    if request.is_ajax():
        portfolio = get_object_or_404(
                Entry,
                portfolio=True,
                slug=slug)
        for n in request.POST.getlist('arr'):
            pict = get_object_or_404(Picture, id=int(n))
            try:
                portfoliopict = Entry_pictures.objects.get(
                        entry=portfolio,
                        picture=pict)
            except:
                portfoliopict = Entry_pictures(
                        entry=portfolio,
                        picture=pict)
                portfoliopict.save()
        portfolio.n_pict = portfolio.pictures.all().count()
        # if it's auto_draft, remove it
        if portfolio.auto_draft:
            portfolio.auto_draft = False
        # if it hasn't been publish publish it
        if not portfolio.is_published:
            portfolio.mail_followers()
        portfolio.clear_cache()
        portfolio.save()

        return HttpResponse(portfolio.n_pict)
    return HttpResponse("request_error")



def AddOrder2Portfolio(request, slug):
    """Fonction to add order to a portfolio's pictures"""
    if request.is_ajax():
        portfolio = get_object_or_404(
                Entry,
                portfolio=True,
                slug=slug)
        for i, n in enumerate(request.POST.getlist('arr')):
            print(n)
            try:
                portfoliopict = Entry_pictures.objects.get(
                        entry=portfolio,
                        picture=int(n))
                portfoliopict.order = i + 1
                portfoliopict.save()
            except:
                pass

        portfolio.order = 'custom'
        portfolio.reversed_order = False
        portfolio.save()

        return HttpResponse("done")
    return HttpResponse("request_error")



def DeletePictFromPost(request, date, slug, pict_pk):
    """Fonction to delete a picture from a entry"""
    if request.is_ajax():
        date = date.replace("/", "-", 2)
        entry = get_object_or_404(Entry, slug=slug, pub_date__startswith=date)
        pict = get_object_or_404(Picture, id=pict_pk)
        try:
            entrypict = Entry_pictures.objects.get(entry=entry, picture=pict)
            entrypict.delete()
        except:
            pass
        entry.n_pict = entry.pictures.all().count()
        if entry.n_pict == 0 and len(entry.content) < 1:
            entry.auto_draft = True
        entry.clear_cache()
        entry.save()

        return HttpResponse(entry.n_pict)
    return HttpResponse("request_error")



def DeletePictFromPortfolio(request, slug, pict_pk):
    """Fonction to delete a picture from a portfolio"""
    # check if it's ajax request
    if request.is_ajax():
        portfolio = get_object_or_404(Entry, portfolio=True, slug=slug)
        pict = get_object_or_404(Picture, id=pict_pk)
        try:
            portfoliopict = Entry_pictures.objects.get(
                    entry=portfolio,
                    picture=pict)
            portfoliopict.delete()
        except:
            pass
        portfolio.n_pict = portfolio.pictures.all().count()
        if portfolio.n_pict == 0:
            portfolio.auto_draft = True
        portfolio.clear_cache()
        portfolio.save()

        return HttpResponse(portfolio.n_pict)
    return HttpResponse("request_error")



class RemovePicture(DeleteView, LibrairyMixin, AjaxableResponseMixin):
    """Fonction to remove a picture from librairy and hard drive."""
    model = Picture
    success_url = reverse_lazy('librairy_home')

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
            html = html = render_to_string(
                    'librairy/librairy_left_panel.html',
                    self.get_context_data())
            return self.render_to_json_response({
                'reload': {'nav#left_panel ul#nav': html},
                'delete': {'article#' + str(self.id): 'delete'}})

        return redirect(self.get_success_url())



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
			return render(
                                request,
                                'librairy/librairy_note.html',
                                {'picture': pict})
		else:
			return HttpResponse("Pict_error")
	return HttpResponse("request_error")

