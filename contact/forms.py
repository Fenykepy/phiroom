from django import forms

from contact.models import Message, Description



class MessageForm(forms.ModelForm):
    """Message creation form."""
    bottrap = forms.CharField(max_length=250, required=False)

    class Meta:
        model = Message
        fields = ('name', 'mail', 'website', 'subject', 'message', 'forward', 'bottrap')

    def __init__(self, *args, **kwargs):
        super(MessageForm, self).__init__(*args, **kwargs)
        self.label_suffix=''

class AuthenticatedMessageForm(MessageForm):
    """Message for authenticated users form."""
    class Meta:
        model = Message
        fields = ('subject', 'message', 'forward', 'bottrap')

class ContactForm(forms.ModelForm):
    """Contact page edition form."""

    class Meta:
        model = Description
        fields = ('title', 'source')
        widgets = {
                'title': forms.TextInput(attrs={'required': 'required'}),
                'source': forms.Textarea(attrs={'cols': 70, 'rows': 15, 'required': 'required', 'placeholder': 'Le contenu de la page de contact, syntaxe markdown.'}),
        }

    def __init__(self, *args, **kwargs):
        super(ContactForm, self).__init__(*args, **kwargs)
        self.label_suffix=''
