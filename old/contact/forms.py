from django import forms
from weblog.forms import ModelForm

from contact.models import Message, Description



class MessageForm(ModelForm):
    """Message creation form."""
    bottrap = forms.CharField(max_length=250, required=False)

    class Meta:
        model = Message
        fields = ('name', 'mail', 'website', 'subject', 'message', 'forward',
                'bottrap')
        widgets = {
            'message': forms.Textarea(attrs={
                'cols': 70,
                'rows': 15,
                'required': 'required',
                'placeholder': 'Tapez votre message ici…'
            }),
            'subject': forms.TextInput(attrs={'required': 'required'}),
        }



class AuthenticatedMessageForm(MessageForm):
    """Message for authenticated users form."""

    class Meta:
        model = Message
        fields = ('subject', 'message', 'forward', 'bottrap')
        widgets = {
            'message': forms.Textarea(attrs={
                'cols': 70,
                'rows': 15,
                'required': 'required',
                'placeholder': 'Tapez votre message ici…'
            }),
            'subject': forms.TextInput(attrs={'required': 'required'}),
        }



class ContactForm(ModelForm):
    """Contact page edition form."""

    class Meta:
        model = Description
        fields = ('title', 'source')
        widgets = {
                'title': forms.TextInput(attrs={'required': 'required'}),
                'source': forms.Textarea(attrs={
                    'cols': 70,
                    'rows': 15,
                    'required': 'required',
                    'placeholder': 'Le contenu de la page de contact, ' +
                    'syntaxe markdown.'}),
        }

