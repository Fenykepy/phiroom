
from django.views.generic import ListView, DetailView, UpdateView
from django.core.urlresolvers import reverse


from weblog.views import ConfMixin, CreateEntry, UpdateEntry, DeleteEntry
from weblog.models import Entry
from portfolio.forms import PortfolioForm



class PortfolioMixin(ConfMixin):
    """Mixin to get generic context for portfolio pages."""
    page_name = 'portfolios'



class ListPortfolios(ListView, PortfolioMixin):
    """List all portfolios by pub_update."""
    model = Entry
    context_object_name = 'entrys'
    template_name = 'portfolios/portfolio_list.html'

    def get_queryset(self):
        return Entry.published.filter(portfolio=True)



class ViewPortfolio(DetailView, PortfolioMixin):
    """Class to view a particular portfolio."""
    model = Entry
    context_object_name = 'entry'
    template_name = 'portfolios/portfolio_view.html'
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Entry.not_draft.filter(slug=self.kwargs['slug'],
                    portfolio=True)
        else:
            return Entry.published.filter(slug=self.kwargs['slug'],
                    portfolio=True)



class CreatePortfolio(PortfolioMixin, CreateEntry):
    """Class to create a new portfolio."""
    form_class = PortfolioForm

    def get_context_data(self, **kwargs):
        context = super(CreatePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouveau portfolio'

        return context

    def form_pre_save(self, form):
        """Executed before saving object."""
        self.object.portfolio = True


class UpdatePortfolio(CreatePortfolio, UpdateView):
    """Class to update a portfolio."""
    def get_context_data(self, **kwargs):
        context = super(UpdatePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Mettre un portfolio à jour'
        context['update'] = True

        return context


class DeletePortfolio(PortfolioMixin, DeleteEntry):
    """Class to delete a portfolio."""
    def get_context_data(self, **kwargs):
        context = super(DeletePortfolio, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer un portfolio'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer le portfolio '
        context['action'] = reverse('portfolio_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context
