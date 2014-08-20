#-*- coding: utf-8 -*-

from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext, ugettext_lazy as _
from django.contrib.auth import authenticate, login

from weblog.forms import ModelForm
from user.models import User



class LoginForm(AuthenticationForm):
    """Login form with placeholder labels"""

    username = forms.CharField(
            max_length=254,
            widget=forms.TextInput(attrs={
                'placeholder': 'Nom d\'utilisateur',
                'required': 'required'
            }
        ))
    password = forms.CharField(
            label=_("Password"),
            widget=forms.PasswordInput(attrs={
                'placeholder': 'Mot de passe',
                'required': 'required'
            }
        ))

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.label_suffix=''


class SuscriptionForm(ModelForm):
    """
    A form that creates a user, with no privileges,
    from the given username and password.
    """

    error_messages = {
        'duplicate_username': _("A user with that username already exists."),
        'password_mismatch': _("The two password fields didn't match."),
    }
    username = forms.RegexField(label=_("Username"), max_length=30,
        regex=r'^[\w.@+-]+$',
        help_text=_("Required. 30 characters or fewer. Letters, digits and "
                "@/./+/-/_ only."),
        widget=forms.TextInput(attrs={
            'placeholder': 'Nom d\'utilisateur', 
            'required': 'required', 
            'pattern': '[\w.@+-]+$'
        }),
        error_messages={
                'invalid': _("This value may contain only letters, numbers and "
                    "@/./+/-/_ characters.")})
    email = forms.EmailField(
            label=_("Email"),
            widget=forms.EmailInput(attrs={
                'placeholder': 'Email',
                'required': 'required'
            }
        ))
    password1 = forms.CharField(label=_("Password"),
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Mot de passe',
            'required': 'required'}))
    password2 = forms.CharField(label=_("Password confirmation"),
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Confirmation du mot de passe',
            'required': 'required'}),
        help_text=_("Enter the same password as above, for verification."))

    class Meta:
        model = User
        fields = ("username",)

    def clean_username(self):
        # Since User.username is unique, this check is redundant,
        # but it sets a nicer error message than the ORM. See #13147.
        username = self.cleaned_data["username"]
        try:
            User._default_manager.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(
            self.error_messages['duplicate_username'],
            code='duplicate_username',
        )

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2


    def save(self, commit=True):
        user = super(SuscriptionForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

    def __init__(self, *args, **kwargs):
        super(SuscriptionForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True


class ProfilForm(ModelForm):
    """Profil edition form."""
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'avatar', 'author_name',
                'signature', 'web_site', 'weblog_mail_newsletter')

class StaffMemberProfilForm(ProfilForm):
    """Profil edition form for staff users."""
    class Meta:
        model = User
        # !!! add mail_comment to the list when comments will work
        fields = ('email', 'first_name', 'last_name', 'avatar', 'author_name',
                'signature', 'web_site', 'weblog_mail_newsletter',
                'mail_contact', 'mail_registration')



