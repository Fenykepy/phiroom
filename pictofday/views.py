import pprint

from datetime import datetime, timedelta, date
from django.utils import timezone
from django.http import Http404
from django.views.generic import DetailView, UpdateView, DeleteView, TemplateView
from django.core.urlresolvers import reverse_lazy, reverse
from django.shortcuts import redirect

from weblog.views import WeblogMixin
from article.views import CreateArticle, DeleteArticle
from pictofday.forms import PictofdayForm
from pictofday.models import Pictofday

class PictofdayMixin(WeblogMixin):
    """Mixin to get generic context for pictofdays pages."""
    page_name = 'pictofdays'


class ViewLastPictofday(TemplateView, PictofdayMixin):
    """Class to show the laste pictofday."""
    template_name = 'pictofdays/pictofday_none.html'

    def render_to_response(self, context, **response_kwargs):
        """
        Returns a response, using the `response_class` for this
        view, with a template rendered with the given context.
        If any keyword arguments are provided, they will be
        passed to the constructor of the response class.
        
        try first to get the last pictofday published, if none return
        no pictofday template

        """
        # try to get last pictofday from today's date
        try:
            # get the single item from the filtered queryset
            pictofday = Pictofday.published.all().order_by('-day_date')[0]
            # redirect to given pictofday
            return redirect(reverse('pictofday_view', kwargs={'date': pictofday.day_date.strftime("%Y/%m/%d")}))
        except:
            pass

        response_kwargs.setdefault('content_type', self.content_type)
        return self.response_class(
            request = self.request,
            template = self.get_template_names(),
            context = context,
            **response_kwargs
        )



class ViewPictofday(DetailView, PictofdayMixin):
    """Class to view a particular pictofday."""
    model = Pictofday
    context_object_name = 'entry'
    template_name = 'pictofdays/pictofday_view.html'

    def get_context_data(self, **kwargs):
        context = super(ViewPictofday, self).get_context_data(**kwargs)
        date = self.kwargs['date'].replace("/", "-", 2)
        # get previous pictofday date which is not in future if user is not staff
        try:
            if self.request.user.is_staff:
                previous_pict = Pictofday.not_draft.filter(day_date__lt=date).order_by('-day_date')[0]
            else:
                previous_pict = Pictofday.published.filter(day_date__lt=date).order_by('-day_date')[0]
            context['previous'] = previous_pict.day_date.strftime("%Y/%m/%d")
        except:
            pass

        # get next pictofday date which is not in future if user is not staff
        try:
            if self.request.user.is_staff:
                next_pict = Pictofday.not_draft.filter(day_date__gt=date).order_by('day_date')[0]
            else:
                next_pict = Pictofday.published.filter(day_date__gt=date).order_by('day_date')[0]
            context['next'] = next_pict.day_date.strftime("%Y/%m/%d")
        except:
            pass

        # if pictofday is not today's one, give a link
        try:
            pictoftoday = Pictofday.published.all().order_by('-day_date')[0]
            if (self.kwargs['date'] != pictoftoday.day_date.strftime("%Y/%m/%d")):
                context['today'] = pictoftoday.day_date.strftime("%Y/%m/%d")
        except:
            pass

        return context

    # redefine get_object to work with a date
    def get_object(self, queryset=None):
        """Returns the object view is displaying"""
        date = self.kwargs['date'].replace("/", "-", 2)
        if self.request.user.is_staff:
            queryset = Pictofday.not_draft.filter(day_date__startswith=date)
        else:
            queryset = Pictofday.published.filter(day_date__startswith=date)

        try:
            # get the single item from the filtered queryset
            obj = queryset.get()
        except:
            raise Http404

        return obj


class CreatePictofday(CreateArticle, PictofdayMixin):
    """Class to create a new pictofday."""
    form_class = PictofdayForm
    model = Pictofday

    def get_context_data(self, **kwargs):
        context = super(CreatePictofday, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer une nouvelle image du jour'
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_edit.html'
            context['cancel_link'] = reverse_lazy('pictofday_home')

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            #return 'forms/forms_auto.html'
            return 'weblog/weblog_edit.html'

    # redefine get_object to work with a date
    def get_object(self, queryset=None):
        """Returns the object view is displaying"""
        date = self.kwargs['date'].replace("/", "-", 2)
        if self.request.user.is_staff:
            queryset = Pictofday.not_draft.filter(day_date__startswith=date)
        else:
            queryset = Pictofday.published.filter(day_date__startswith=date)
        try:
            # get the single item from the filtered queryset
            obj = queryset.get()
        except:
            raise Http404

        return obj

    def get_pictofday_date(self):
        """Get pictofday date if needed."""
        if not self.object.day_date:
            try:
                # search last registered pictofday
                last_pictofday = Pictofday.objects.all().order_by('-day_date')[0]

                # set one day more to the new pictofday
                self.object.day_date = last_pictofday.day_date + timedelta(days=1)

            except:
                # if no other pictofday, date is now
                self.object.day_date = timezone.now()
                
        # set pubdate equal to day_date else publish manager doesn't work
        self.object.pub_date = datetime.combine(self.object.day_date, datetime.min.time()).replace(tzinfo=timezone.utc)

    def form_save_pictures(self, form):
        """Check if object has picture and set auto_draft if needed."""
        if not self.object.picture:
            self.object.auto_draft = True

    def get_success_url(self):
        """returns url"""
        if (self.object.auto_draft or self.object.draft):
            return reverse('librairy_home')
        return reverse('pictofday_view', kwargs={'date': self.object.day_date.strftime("%Y/%m/%d")})



class UpdatePictofday(CreatePictofday, UpdateView):
    """Class to update a pictofday."""
    def get_context_data(self, **kwargs):
        context = super(UpdatePictofday, self).get_context_data(**kwargs)
        context['title'] = 'Mettre à jour une image du jour'
        context['update'] = True

        return context



class DeletePictofday(DeleteArticle):
    """Class to delete a pictofday."""
    model = Pictofday

    def get_context_data(self, **kwargs):
        context = super(DeletePictofday, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer une image du jour'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer l\'image du jour'
        context['action'] = reverse('pictofday_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context

    # redefine get_object to work from date
    def get_object(self, queryset=None):
        """Returns the object view is displaying"""
        date = self.kwargs['date'].replace("/", "-", 2)
        queryset = Pictofday.objects.filter(day_date=date)

        try:
            # get the single item from the filtered queryset
            obj = queryset.get()
        except:
            raise Http404

        return obj
