#-*- coding: utf-8 -*-


from django.views.generic import ListView, DetailView, UpdateView, DeleteView
from django.core.urlresolvers import reverse_lazy, reverse

from portfolio.models import Portfolio, Portfolio_pictures
from weblog.views import ConfMixin
from gallery.views import CreateGallery, DeleteGallery
from portfolio.forms import PortfolioForm

class PortfolioMixin(ConfMixin):
    """Mixin to get generic context for portfolio pages."""
    page_name = 'portfolios'


class ListPortfolios(ListView, PortfolioMixin):
    """List all portfolios by pub_update."""
    model = Portfolio
    context_object_name = 'entrys'
    template_name = 'portfolios/portfolio_list.html'

    def get_queryset(self):
        return Portfolio.published.all()

class ViewPortfolio(DetailView, PortfolioMixin):
    """Class to view a particular portfolio."""
    model = Portfolio
    context_object_name = 'entry'
    template_name = 'portfolios/portfolio_view.html'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Portfolio.not_draft.filter(slug=self.kwargs['slug'])
        else:
            return Portfolio.published.filter(slug=self.kwargs['slug'])


class CreatePortfolio(PortfolioMixin, CreateGallery):
    """Class to create a new portfolio."""
    form_class = PortfolioForm
    model = Portfolio
    through_model = Portfolio_pictures

    def get_context_data(self, **kwargs):
        context = super(CreatePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouveau portfolio'
        
        return context

    def get_success_url(self):
        """returns url"""
        if (self.object.auto_draft or self.object.draft):
            return reverse('librairy_home')
        return reverse('portfolio_view', kwargs={'slug': self.object.slug})


    def form_save_pictures(self, form):
        """Save pictures associated with form."""
        # check if collection or folder has been given
        collection = form.cleaned_data.get('collection')
        folder = form.cleaned_data.get('folder')
        if collection:
            # saving related pictures from collection
            for item in collection.pictures.all():
                try:
                    pict = self.through_model.objects.get(portfolio=self.object, picture=item)
                except:
                    pict = self.through_model(portfolio=self.object, picture=item)
                    pict.save()

        if folder:
            # saving related pictures from folder
            for item in folder.get_directory_pictures():
                try:
                    pict = self.through_model.objects.get(portfolio=self.object, picture=item)
                except:
                    pict = self.through_model(portfolio=self.object, picture=item)
                    pict.save()

        self.object.n_pict = self.object.pictures.all().count()
        if self.object.n_pict < 1:
            # if portfolio has no pictures set auto_draft to True
            # (to prevent publication of empty portfolios)
            self.object.auto_draft = True
        # save again to have nbr of picture and auto_draft_state
        self.object.save()


class UpdatePortfolio(CreatePortfolio, UpdateView):
    """Class to update a portfolio."""
    def get_context_data(self, **kwargs):
        context = super(UpdatePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Mettre un portfolio à jour'
        context['update'] = True

        return context


class DeletePortfolio(PortfolioMixin, DeleteGallery):
    """Class to delete a portfolio."""
    model = Portfolio

    def get_context_data(self, **kwargs):
        context = super(DeletePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer un portfolio'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer le portfolio'
        context['action'] = reverse('portfolio_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context


