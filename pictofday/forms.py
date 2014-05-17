from pprint import pprint
from django import forms

from article.forms import ArticleForm
from pictofday.models import Pictofday
from librairy.models import Picture

class PictofdayForm(ArticleForm):
    """Pictofday Edition and creation form."""
    def __init__(self, *args, **kwargs):
        super(PictofdayForm, self).__init__(*args, **kwargs)
        self.fields['source'].label = "Description de l'image du jour"
        # select pictures with no pictofday
        pictures = Picture.objects.filter(pictofday=None)
        pictures_choices = []
        pictures_choices.append(('', '------'))
        # add the current pictofday to choices if it's an update
        if self.instance.id:
            picture = Picture.objects.get(id=self.instance.picture.id)
            pictures_choices.append((picture.id, picture))
        for picture in pictures:
            pictures_choices.append((picture.id, picture))
        # add list of pictofday to choices
        self.fields['picture'].choices = pictures_choices


    class Meta:
        model = Pictofday
        fields = ('category', 'picture', 'title', 'day_date', 'tags', 'source', 'draft')
        widgets = {
                'title': forms.TextInput(attrs={'required': 'required'}),
                'day_date': forms.DateInput(attrs={'placeholder': 'Date de l\'image du jour jj/mm/aaaa (optionnelle)', 'size': '11'}),
                'source': forms.Textarea(attrs={'cols': 70, 'rows': 15, 'required': 'required', 'placeholder': 'La description de l\'image du jour, syntaxe markdown'}),
                'tags': forms.CheckboxSelectMultiple(),
        }

