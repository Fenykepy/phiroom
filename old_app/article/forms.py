from django import forms

from article.models import Article

class Form(forms.Form):
    def __init__(self, *args, **kwargs):
        super(Form, self).__init__(*args, **kwargs)
        self.label_suffix=''

class ArticleForm(forms.ModelForm):
    """Article edition and creation form"""
    minor_change = forms.BooleanField(required=False, initial=True, label="Modification mineure")
    new_tags = forms.CharField(max_length=250, label="Nouveaux mots clés", widget=forms.TextInput(attrs={'maxlength':'250','placeholder': 'Nouveaux mots clés, séparés par des virgules ","', 'size': '50'}))
    class Meta:
        model = Article
        fields = ('category', 'title', 'tags', 'pub_date', 'source', 'draft')
        widgets = {
            'title': forms.TextInput(attrs={'required': 'required'}),
            'pub_date': forms.DateTimeInput(attrs={'placeholder': 'Date de publication jj/mm/aaaa hh:mm:ss (optionnelle)', 'size': '19'}),
            'source': forms.Textarea(attrs={'cols': 70, 'rows': 15, 'required': 'required', 'placeholder': 'Le contenu de l\'article, syntaxe markdown'}),
            'tags': forms.CheckboxSelectMultiple(),
        }

    def __init__(self, *args, **kwargs):
        super(ArticleForm, self).__init__(*args, **kwargs)
        self.label_suffix=''
        self.fields['tags'].required = False
        self.fields['new_tags'].required = False


