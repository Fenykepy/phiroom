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
