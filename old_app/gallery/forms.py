from django import forms

from mptt.forms import TreeNodeChoiceField

from article.forms import ArticleForm
from librairy.models import Collection, Directory
from gallery.models import Gallery


class GalleryForm(ArticleForm):
    """Galerie creation form."""
    collection = forms.ModelChoiceField(queryset=Collection.objects.all(), label="Utiliser les images d'une collection", required=False)
    folder = TreeNodeChoiceField(queryset=Directory.objects.all(), label="Utiliser les images d'un dossier", required=False)

    def __init__(self, *args, **kwargs):
        super(GalleryForm, self).__init__(*args, **kwargs)
        self.fields['source'].label = "Description de la galerie"
        self.fields['order'].label = "Classement des images par :"

    class Meta:
        model = Gallery
        fields = ('category', 'title', 'tags', 'order', 'reversed_order', 'pub_date', 'source', 'draft')
        widgets = {
            'title': forms.TextInput(attrs={'required': 'required'}),
            'pub_date': forms.DateTimeInput(attrs={'placeholder': 'Date de publication jj/mm/aaaa hh:mm:ss (optionnelle)', 'size': '19'}),
            'source': forms.Textarea(attrs={'cols': 70, 'rows': 15, 'required': 'required', 'placeholder': 'La description de la galerie, syntaxe markdown'}),
            'tags': forms.CheckboxSelectMultiple(),
        }

