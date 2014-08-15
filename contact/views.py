from django.views.generic import TemplateView, UpdateView, CreateView, ListView, DetailView
from django.core.mail import send_mail, mail_managers
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import redirect

from weblog.views import WeblogMixin
from contact.forms import MessageForm, AuthenticatedMessageForm
from contact.models import Message


class ContactMixin(WeblogMixin):
    """Mixin to get generic context for contact pages."""
    page_name = "contact"

class ViewContact(CreateView, ContactMixin):
    """Class to show contact page."""
    model = Message
    template_name = "contact/contact_view.html"
    success_url = reverse_lazy('contact_sent')

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

        # definition of IP
        self.object.ip = self.request.META.get('REMOTE_ADDR')

        # save form
        self.object.save()

        # forward mail to sender if necessary
        if self.object.forward:
            send_mail(self.object.subject, self.object.message, None, [self.object.mail])

        # send to 
        mail_managers(self.object.subject, self.object.message)

        return redirect(self.get_success_url())





class UpdateContact(UpdateView, ContactMixin):
    """Class to update contact page."""
    pass

class SentMessage(TemplateView, ContactMixin):
    """Class to be redirect to when a message has been sent."""
    template_name = "contact/contact_sent.html"

class ListMessages(ListView, ContactMixin):
    """Class to list all messages."""
    pass

class ViewMessage(DetailView, ContactMixin):
    """Class to view a specific message."""
    pass
