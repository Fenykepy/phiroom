
from django import forms
from django.template.defaultfilters import slugify

from mptt.forms import TreeNodeChoiceField
from article.forms import Form

from weblog.models import Category, Tag


    
class CreateCategoryForm(Form):
    """Category creation form"""
    name = forms.CharField(max_length=30, label="Nom", widget=forms.TextInput(attrs={'required': 'required'}))
    parent = TreeNodeChoiceField(queryset=Category.objects.all(), label="Placer comme sous catégorie de", required=False)

    def clean(self):
        cleaned_data = super(CreateCategoryForm, self).clean()
        new_category = cleaned_data.get('name')
        parent = cleaned_data.get('parent')
        slug = slugify(new_category)

        # check if name already exists
        category = Category.objects.filter(name=new_category, parent=parent, slug=slug)
        # if get a result category already exists, raise an error
        if category:
            # define error message
            msg = "La catégorie est déjà existante"
            # display error message
            self._errors["name"] = self.error_class([msg])
            # delete not cleaned data
            del cleaned_data["name"]
        else:
            # create new category
            cleaned_data["object"] = Category.objects.create(name=new_category, slug=slug, parent=parent)

        # returns data if everything is correct
        return cleaned_data

