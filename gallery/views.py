from django.views.generic import DetailView, UpdateView, DeleteView
from django.core.urlresolvers import reverse_lazy, reverse

from weblog.views import WeblogMixin
from article.views import CreateArticle, DeleteArticle
from gallery.forms import GalleryForm
from gallery.models import Gallery, Gallery_pictures
from librairy.models import Picture

class GalleryMixin(WeblogMixin):
    """Mixin to get generic context for pictofdays pages."""
    page_name = 'gallery'

class ViewGallery(DetailView, GalleryMixin):
    """Class to view a particular gallery."""
    model = Gallery
    context_object_name = 'entry'
    template_name = 'gallerys/gallery_view.html'

    def get_queryset(self):
        date = self.kwargs['date'].replace("/", "-", 2)
        if self.request.user.is_staff:
            return Gallery.not_draft.filter(slug=self.kwargs['slug'], pub_date__startswith=date)
        return Gallery.published.filter(slug=self.kwargs['slug'], pub_date__startswith=date)


class CreateGallery(GalleryMixin, CreateArticle):
    """Class to create a new gallery."""
    form_class = GalleryForm
    model = Gallery
    through_model = Gallery_pictures

    def get_context_data(self, **kwargs):
        context = super(CreateGallery, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer une nouvelle galerie'
        return context

    def get_success_url(self):
        """returns url"""
        if (self.object.auto_draft or self.object.draft):
            return reverse('librairy_home')
        return reverse('gallery_view', kwargs={'date': self.object.pub_date.strftime("%Y/%m/%d") , 'slug': self.object.slug})


    def form_save_pictures(self, form):
        """Save pictures associated with form."""
        # check if collection or folder has been given
        collection = form.cleaned_data.get('collection')
        folder = form.cleaned_data.get('folder')
        if collection:
            # saving related pictures from collection
            for item in collection.pictures.all():
                try:
                    pict = self.through_model.objects.get(gallery=self.object, picture=item)
                except:
                    pict = self.through_model(gallery=self.object, picture=item)
                    pict.save()

        if folder:
            # saving related pictures from folder
            for item in folder.get_directory_pictures():
                try:
                    pict = self.through_model.objects.get(gallery=self.object, picture=item)
                except:
                    pict = self.through_model(gallery=self.object, picture=item)
                    pict.save()

        self.object.n_pict = self.object.pictures.all().count()
        if self.object.n_pict < 1:
            # if gallery has no pictures set auto_draft to True
            #(to prevent publication of empty gallerys)
            self.object.auto_draft = True
        # save again to have nbr of picture and auto_draft_state
        self.object.save()



class UpdateGallery(CreateGallery, UpdateView):
    """Class to update a gallery."""
    def get_context_data(self, **kwargs):
        context = super(UpdateGallery, self).get_context_data(**kwargs)
        context['title'] = 'Mettre une galerie à jour'
        context['update'] = True

        return context



class DeleteGallery(GalleryMixin, DeleteArticle):
    """Class to delete an article"""
    model = Gallery

    def get_context_data(self, **kwargs):
        context = super(DeleteArticle, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer une galerie'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer la galerie'
        context['action'] = reverse('gallery_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context


