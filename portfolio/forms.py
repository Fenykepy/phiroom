from django import forms
from gallery.forms import GalleryForm
from portfolio.models import Portfolio


class PortfolioForm(GalleryForm):
    """Portfolio creation form."""
    def __init__(self, *args, **kwargs):
        super(PortfolioForm, self).__init__(*args, **kwargs)
        self.fields['source'].label = "Description du portfolio"
        self.fields['order'].label = "Classement des images par :"

    class Meta:
        model = Portfolio
        fields = ('category', 'title', 'tags', 'order', 'reversed_order', 'pub_date', 'source', 'draft')
        widgets = {
            'title': forms.TextInput(attrs={'required': 'required'}),
            'pub_date': forms.DateTimeInput(attrs={'placeholder': 'Date de publication jj/mm/aaaa hh:mm:ss (optionnelle)', 'size': '19'}),
            'source': forms.Textarea(attrs={'cols': 70, 'rows': 15, 'required': 'required', 'placeholder': 'La description du portfolio, syntaxe markdown'}),
            'tags': forms.CheckboxSelectMultiple(),
        }

