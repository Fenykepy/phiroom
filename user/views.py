#-*- coding: utf-8 -*-
from pprint import pprint

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.generic import FormView, UpdateView
from django.core.urlresolvers import reverse_lazy, reverse
from django.core.mail import send_mail, mail_managers

from phiroom.settings import DEFAULT_FROM_EMAIL
from user.models import User
from user.forms import LoginForm, SuscriptionForm, ProfilForm
from weblog.views import WeblogMixin
from article.views import AjaxableResponseMixin
from conf.models import Conf

# login class
class LoginView(FormView,WeblogMixin):
    """ Class to login a user, return error = True if user / password couple isn't good"""
    form_class = LoginForm
    success_url = reverse_lazy('user_login')
    page_name = 'login'

    def get_context_data(self, **kwargs):
        context = super(LoginView, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'user/user_login.html'
        
        return context

    def get_template_names(self, **kwargs):
        if self.request.is_ajax():
            return 'user/user_login.html'
        else:
            return 'weblog/weblog_forms.html'


    def form_valid(self, form):
        login(self.request, form.get_user()) # connect user
        if self.request.GET:
            return redirect(self.request.GET['next'])
        return redirect(reverse_lazy('user_login'))

# logout
def logout_view(request):
    logout(request)
    return redirect(reverse('user_login'))

# suscription class
class SuscriptionView(FormView,WeblogMixin):
    form_class = SuscriptionForm
    success_url = reverse_lazy('user_suscription')
    page_name = 'suscription'

    def get_context_data(self, **kwargs):
        context = super(SuscriptionView, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'user/user_suscription.html'

        return context

    def get_template_names(self, **kwargs):
        if self.request.is_ajax():
            return 'user/user_suscription.html'
        else:
            return 'weblog/weblog_forms.html'


    def __init__(self, *args, **kwargs):
        super(SuscriptionView, self).__init__(*args, **kwargs)
        self.conf = Conf.objects.latest('date')

    def form_valid(self, form):
        form.save()
        username = form.cleaned_data["username"] # get username
        password = form.cleaned_data["password1"] # get password

        user = authenticate(username=username, password=password) # check if user exists
        if user:
            login(self.request, user) # connect user
            # send mail to new user
            subject = 'Bienvenue !'
            message = (
                "Merci d'avoir créé un compte sur {0},\n"
                "vous trouverez dans ce message un rappel de vos identifiants et code d'accès :\n"
                "\n"
                "Nom d'utilisateur : {1}\n"
                "Mot de passe : {2}\n"
                "\n"
                "Vous pouvez dès à présent modifier votre profil ici :\n"
                "{3}\n"
            ).format(self.conf.title, user.username, user.password, self.request.build_absolute_uri(reverse('user_profil')))
            send_mail(subject, message, DEFAULT_FROM_EMAIL, [user.email])

            if self.conf.mail_suscription:
                subject = "Nouvelle inscription sur {0}".format(self.conf.title)
                message = (
                    "Un nouvel utilisateur s'est inscrit sur {0}\n"
                    "Nom d'utilisateur : {1}\n"
                    "Email : {2}.\n"
                    "\n"
                    "Vous recevez cet email car vous êtes dans la liste des administrateurs de {0}\n"
                    "et que l'option de configuration « mail inscription » est activée.\n"
                    "Pour ne plus recevoir de mails lors des inscription suivez ce lien :\n"
                    "{3}\n"
                    "décochez l'option « mail inscription » puis enregistrer."
                ).format(self.conf.title, user.username, user.email,
                    self.request.build_absolute_uri(reverse('conf_settings')))
                mail_managers(subject, message)

        return super(SuscriptionView, self).form_valid(form)

class ProfilView(AjaxableResponseMixin, UpdateView, WeblogMixin):
    """Class to update user's profil."""
    model = User
    form_class = ProfilForm
    page_name = 'profil'
    success_url = reverse_lazy('weblog_home')

    def get_object(self, queryset=None):
        """Returns the object view is displaying."""
        return User.objects.get(username=self.request.user.username)



    def get_context_data(self, **kwargs):
        context = super(ProfilView, self).get_context_data(**kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'user/user_profil.html'
        
        return context


    def get_template_names(self, **kwargs):
        if self.request.is_ajax():
            return 'user/user_profil.html'
        else:
            return 'weblog/weblog_forms.html'





class RecoveryView(SuscriptionView):
    pass
