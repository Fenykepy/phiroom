#-*- coding: utf-8 -*-

from django.views.generic import UpdateView, ListView
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import redirect

from conf.models import Conf
from conf.forms import SettingsForm
from weblog.views import WeblogMixin, AjaxableResponseMixin

class SettingsMixin(WeblogMixin):
    """Mixin to get generic context for settings pages."""
    page_name = 'settings'

class ListSettings(ListView, SettingsMixin):
    """Class to list old versions of settings."""
    model = Conf
    context_object_name = "entrys"
    template_name= "settings/settings_list.html"
    paginate_by = 5

class SetNewSettings(AjaxableResponseMixin, UpdateView, SettingsMixin):
    """Class to set a new version of phiroom's settings."""
    form_class = SettingsForm
    success_url = reverse_lazy('weblog_home')


    def get_context_data(self, **kwargs):
        context = super(SetNewSettings, self).get_context_data(**kwargs)
        context['title'] = 'Nouvelle configuration'
        context['action'] = reverse_lazy('conf_settings')
        context['button'] = "Enregistrer"
        if not self.request.is_ajax():
            context['tempinclude'] = 'settings/settings_form.html'
            context['cancel_link'] = reverse_lazy('weblog_home')

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            return 'settings/settings_form.html'

    def get_object(self, queryset=None):
        """Returns the object view is displaying."""
        return Conf.objects.latest()

    def form_valid(self, form):
        """If form is correct, save new conf object."""
        new_conf = form.save(commit=False)
        new_conf.pk = None
        new_conf.date = None
        new_conf.save()
        return redirect(self.get_success_url())
