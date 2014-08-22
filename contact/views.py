import json

from django.views.generic import TemplateView, UpdateView, CreateView, \
        ListView, DetailView
from django.core.mail import send_mail
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string

from phiroom.settings import DEFAULT_FROM_EMAIL
from weblog.views import WeblogMixin, AjaxableResponseMixin
from weblog.utils import format_content
from contact.forms import MessageForm, AuthenticatedMessageForm, ContactForm
from contact.models import Message, Description
from user.models import mail_contactmembers


class ContactMixin(WeblogMixin):
    """Mixin to get generic context for contact pages."""
    page_name = "contact"

class ViewContact(CreateView, ContactMixin):
    """Class to show contact page."""
    model = Message
    template_name = "contact/contact_view.html"
    success_url = reverse_lazy('contact_sent')

    def get_context_data(self, **kwargs):
        context = super(ViewContact, self).get_context_data(**kwargs)
        context['entry'] = Description.objects.values(
                'content', 'title').latest()

        return context

    def get_form_class(self):
        """To get good form class."""
        if self.request.user.is_authenticated():
            return AuthenticatedMessageForm
        else:
            return MessageForm

    def form_valid(self, form):
        """If form is valid, save associated model."""
        self.object = form.save(commit=False)
        
        # if some bot wrote in trap field, abort
        if 'bottrap' in form.data and len(form.data['bottrap']) > 0:
            return self.render_to_response(self.get_context_data(form=form))

        # definition of user
        if self.request.user.is_authenticated():
            self.object.user = self.request.user
            self.object.name = self.request.user.username
            self.object.mail = self.object.user.email
            self.object.website = self.object.user.web_site

        # definition of IP
        self.object.ip = self.request.META.get('REMOTE_ADDR')

        # save form
        self.object.save()

        # forward mail to sender if necessary
        if self.object.forward:
            subject = "[{0}] {1}".format(
                    self.conf.domain,
                    self.object.subject
                )
            send_mail(
                    subject,
                    self.object.message,
                    DEFAULT_FROM_EMAIL,
                    [self.object.mail]
                )

        # send to superusers
        subject = "[{0}] Nouveau message".format(self.conf.domain)
        message = (
                "Nom : {0}\n"
                "Email : {1}\n"
                "Site web : http://{2}\n\n"
                "vous a envoyé un message.\n\n"
                "Objet : {3}\n"
                "Message:\n"
                "{4}\n"
                ).format(
                        self.object.name,
                        self.object.mail,
                        self.object.website,
                        self.object.subject,
                        self.object.message
                    )
        mail_contactmembers(subject, message)

        return redirect(self.get_success_url())





class UpdateContact(AjaxableResponseMixin, UpdateView, ContactMixin):
    """Class to update contact page."""
    form_class = ContactForm
    model = Description
    success_url = reverse_lazy('contact_home')

    def get_context_data(self, **kwargs):
        context = super(UpdateContact, self).get_context_data(**kwargs)
        context['title'] = 'Mettre à jour la page de contact'
        if not self.request.is_ajax():
            context['tempinclude'] = 'contact/contact_edit.html'
            context['cancel_link'] = reverse_lazy('contact_home')

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            return 'contact/contact_edit.html'

    def get_object(self, queryset=None):
        """Returns the object view is displaying."""
        return Description.objects.latest()

    def form_valid(self, form):
        """If form is valid, save associated model."""
        self.object = form.save(commit=False)
        # definition of author
        self.object.author = self.request.user
        # definition of content
        self.object.content = format_content(self.object.source)

        if 'contact_save' in form.data:
            # reset pk and date to save a new entry
            self.object.pk = None
            self.object.date_update = None
            # save object in db
            self.object.save()
            # redirect user
            if self.request.is_ajax():
                return HttpResponse(
                    content=json.dumps({'redirect': self.get_success_url()}),
                    content_type='application/json')
            return redirect(self.get_success_url())

        elif 'contact_preview' in form.data:
            # return form and object for preview
            if self.request.is_ajax():
                html =  render_to_string(
                    self.get_template_names(),
                    self.get_context_data(form=form,
                        contact_preview=self.object,
                        request=self.request))
                return self.render_to_json_response({
                    'form': html,
                    'moveto': '#preview'
                })
            return self.render_to_response(self.get_context_data(
                form=form,
                contact_preview=self.object,
                request=self.request
            ))


    

class SentMessage(TemplateView, ContactMixin):
    """Class to be redirect to when a message has been sent."""
    template_name = "contact/contact_sent.html"

class ListMessages(ListView, ContactMixin):
    """Class to list all messages."""
    pass

class ViewMessage(DetailView, ContactMixin):
    """Class to view a specific message."""
    pass
