from django import forms

from mptt.forms import TreeNodeChoiceField

from weblog.models import Entry
from librairy.models import Collection, Directory



class Form(forms.Form):
    def __init__(self, *args, **kwargs):
        super(Form, self).__init__(*args, **kwargs)
        self.label_suffix=''



class ModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ModelForm, self).__init__(*args, **kwargs)
        self.label_suffix=''



class EntryForm(ModelForm):
    """Entry edition and creation form."""
    minor_change = forms.BooleanField(required=False, initial=True,
            label="Modification mineure")
    new_tags = forms.CharField(max_length=250, label="Nouveaux mots clés",
        widget=forms.TextInput(attrs={
            'maxlength':'250',
            'placeholder': 'Nouveaux mots clés, séparés par des virgules ","', 
            'size': '50'
        }))
    collection = forms.ModelChoiceField(queryset=Collection.objects.all(),
            label="Utiliser les images d'une collection", required=False)
    folder = TreeNodeChoiceField(queryset=Directory.objects.all(),
            label="Utiliser les images d'un dossier", required=False)


    class Meta:
        model = Entry
        fields = ('title', 'tags', 'order', 'reversed_order', 
                'pub_date', 'source', 'draft')
        widgets = {
                'title': forms.TextInput(attrs={'required': 'required'}),
                'pub_date': forms.DateTimeInput(attrs={
                    'placeholder': 'Date de publication jj/mm/aaaa hh:mm:ss ' +
                    '(optionnelle)',
                    'size': '19'}),
                'source': forms.Textarea(attrs={'cols': 70,
                    'rows': 15,
                    'required': 'required',
                    'placeholder': 'Le contenu du post, syntaxe markdown'}),
                'tags': forms.CheckboxSelectMultiple(),
                }


    def __init__(self, *args, **kwargs):
        super(EntryForm, self).__init__(*args, **kwargs)
        self.fields['tags'].required = False
        self.fields['new_tags'].required = False
        self.fields['order'].label = "Classement des images par :"

