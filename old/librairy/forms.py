#-*- coding: utf-8 -*-

import os

from django.template.defaultfilters import slugify
from django import forms

from mptt.forms import TreeNodeChoiceField 

from phiroom.settings import LIBRAIRY

from weblog.forms import Form
from weblog.models import Tag, Entry
from librairy.models import Picture, Directory, CollectionsEnsemble, \
    Collection, Collection_pictures, PICTURES_ORDERING_CHOICES, ancestors2list 



class RelativeFilePathField(forms.ChoiceField):
    def __init__(self, path, match=None, recursive=False, allow_files=True,
                 allow_folders=False, required=True, widget=None, label=None,
                 initial=None, help_text='', *args, **kwargs):
        self.path, self.match, self.recursive = path, match, recursive
        self.allow_files, self.allow_folders = allow_files, allow_folders
        super(RelativeFilePathField, self).__init__(choices=(), required=required,
            widget=widget, label=label, initial=initial, help_text=help_text,
            *args, **kwargs)

        self.choices = [("", "---------")]

        if self.match is not None:
            self.match_re = re.compile(self.match)

        if recursive:
            for root, dirs, files in sorted(os.walk(self.path)):
                dirs.sort()
                if self.allow_files:
                    for f in files:
                        if self.match is None or self.match_re.search(f):
                            f = os.path.join(root, f)
                            h = f.replace(path, "", 1) + '/'
                            self.choices.append((h, h))
                if self.allow_folders:
                    for f in dirs:
                        if f == '__pycache__':
                            continue
                        if self.match is None or self.match_re.search(f):
                            f = os.path.join(root, f)
                            h = f.replace(path, "", 1) + '/'
                            self.choices.append((h, h))
        else:
            try:
                for f in sorted(os.listdir(self.path)):
                    if f == '__pycache__':
                        continue
                    full_file = os.path.join(self.path, f)
                    if (((self.allow_files and os.path.isfile(full_file)) or
                        (self.allow_folders and os.path.isdir(full_file))) and
                        (self.match is None or self.match_re.search(f))):
                        self.choices.append((full_file, f))
            except OSError:
                pass

        self.widget.choices = self.choices



class ImportForm(Form):
    """Pictures importation form"""
    def __init__(self, *args, **kwargs):
        super(ImportForm, self).__init__(*args, **kwargs)
        self.fields['folder'] = RelativeFilePathField(LIBRAIRY,
                allow_files=False,
                allow_folders=True,
                recursive=True,
                label="Dossier",
                required=True)
        self.fields['previews'] = forms.BooleanField(
                label="Régénérer les aperçus des images existantes",
                required=False)
        self.fields['metadatas'] = forms.BooleanField(
                label="Recharger les métadonnées des images existantes",
                required=False)



class CreateFolderForm(Form):
    """Folder creation form"""
    name = forms.CharField(max_length=150, label="Nom",
            widget=forms.TextInput(attrs={'required': 'required'}))
    parent = TreeNodeChoiceField(queryset=Directory.objects.all(),
            label="Placer dans un dossier existant", required=False)

    def clean(self):
        cleaned_data = super(CreateFolderForm, self).clean()
        new_folder = cleaned_data.get('name')
        parent = cleaned_data.get('parent')
        slug = slugify(new_folder)

        # If parent and parent doesn't exists, raise an error
        if parent:
            # get parent ancestors
            ancestors = parent.get_ancestors(include_self=True)
            ancestors_path = os.path.join(LIBRAIRY,
                    '/'.join(ancestors2list(ancestors)))
            # if parent is not a folder
            if not os.path.isdir(ancestors_path):
                msg = "Erreur sur le dossier parent"
                # display error message
                self._errors["parent"] = self.error_class([msg])
                # delete not cleaned data
                del cleaned_data["parent"]

        # define full path to new folder
        if 'ancestors_path' in locals():
            new_folder_path = os.path.join(ancestors_path, slug)
        else:
            new_folder_path = os.path.join(LIBRAIRY, slug)

        # if new folder or file with same name already exists
        if os.path.exists(new_folder_path):
            # define error message
            msg = "Le dossier est déjà existant"
            # display error message
            self._errors["name"] = self.error_class([msg])
            # delete non cleaned data
            del cleaned_data["name"]
        else:
            # create new folder
            os.makedirs(new_folder_path)
            # insert folder in database
            if 'parent' in locals():
                Directory.objects.create(
                        name=new_folder, 
                        slug=slug, 
                        parent=parent)
            else:
                Directory.objects.create(name=new_folder, slug=slug)

        # Returns data if everything is correct
        return cleaned_data



class RenameFolderForm(Form):
    """Forder renaming form"""
    folder = TreeNodeChoiceField(
            queryset=Directory.objects.all(),
            label="Dossier à renommer",
            required=True)
    new_name = forms.CharField(
            max_length=150,
            label="Nouveau nom",
            widget=forms.TextInput(attrs={'required': 'required'}))
    
    def clean(self):
        cleaned_data = super(RenameFolderForm, self).clean()
        new_name = cleaned_data.get('new_name')
        folder = cleaned_data.get('folder')
        slug = slugify(new_name)

        # if no folder choosen, raise an error
        if not folder:
            # define error message
            msg = "Veuillez choisir le dossier à renommer"
            # display error message
            self._errors["folder"] = self.error_class([msg])
            # delete non cleaned data
        else:
            # define old name absolute path
            ancestors = folder.get_ancestors(include_self=True)
            ancestors_path = os.path.join(LIBRAIRY,
                    '/'.join(ancestors2list(ancestors)))

            # define new name absolute path
            new_ancestors = folder.get_ancestors()
            new_path = os.path.join(LIBRAIRY,
                    '/'.join(ancestors2list(new_ancestors)), slug)

            # if folder doesn't exists, raise an error
            if not os.path.isdir(ancestors_path):
                # define error message
                msg = "Erreur sur le dossier à modifier"
                # display error message
                self._errors["folder"] = self.error_class([msg])
                # delete non cleaned data
                del cleaned_data["folder"]

            # if new path already exists, raise an error
            if os.path.exists(new_path):
                # define error message
                msg = "Erreur le fichier de destination est existant"
                # display error message
                self._errors["new_name"] = self.error_class([msg])
                # delete non cleaned data
                del cleaned_data["new_name"]
            else:
                # rename file
                os.rename(ancestors_path, new_path)
                # change name in database
                folder.name = new_name
                folder.slug = slug
                folder.save()

        # Returns data if everything is correct
        return cleaned_data



class DeleteFolderForm(Form):
    """Folder deleting form"""
    folder = TreeNodeChoiceField(
            queryset=Directory.objects.all(),
            label="Dossier à effacer",
            required=True)

    def clean(self):
        cleaned_data = super(DeleteFolderForm, self).clean()
        folder = cleaned_data.get('folder')


        # if no folder choosen, raise an error
        if not folder:
            # define error message
            msg = "Veuillez choisir le dossier à supprimer"
            # display error message
            self._errors["folder"] = self.error_class([msg])
            # delete non cleaned data
        else:    
            # define absolute path
            ancestors = folder.get_ancestors(include_self=True)
            ancestors_path = os.path.join(LIBRAIRY,
                    '/'.join(ancestors2list(ancestors)))

            # Count folder's number of descendant 
            descendant_count = folder.get_descendant_count()

            # Count number of pictures in folder
            pictures_count = Picture.objects.filter(directory=folder).count()


            # if folder doesn't exists, raise an error
            if not os.path.isdir(ancestors_path):
                # define error message
                msg = "Erreur sur le dossier à effacer"
                # display error message
                self._errors["folder"] = self.error_class([msg])
                # delete non cleaned data
                del cleaned_data["folder"]

            # if folder has descendants, raise an error
            elif descendant_count >= 1:
                # define error message
                msg = "Le dossier n'est pas vide : il contient " + str(
                        descendant_count) + " sous-dossiers"
                # display error message
                self._errors["folder"] = self.error_class([msg])
                # delete non cleaned data
                del cleaned_data["folder"]

            # if folder has pictures
            elif pictures_count >= 1:
                # define error message
                msg = "Le dossier n'est pas vide : il contient " + str(
                        pictures_count) + " images"
                # display error message
                self._errors["folder"] = self.error_class([msg])
                # delete non cleaned data
                del cleaned_data["folder"]
            
            else:
                # delete folder in filesystem
                os.rmdir(ancestors_path)
                # delete folder in db
                folder.delete()
                
        # Returns data if everything is correct
        return cleaned_data
   


class CreateCollectionsEnsembleForm(Form):
    """Collections Ensemble creation form"""
    name = forms.CharField(
            max_length=150,
            label="Nom",
            widget=forms.TextInput(attrs={'required': 'required'}))
    parent = TreeNodeChoiceField(
            queryset=CollectionsEnsemble.objects.all(),
            label="Placer dans un ensemble existant",
            required=False)

    def clean(self):
        cleaned_data = super(CreateCollectionsEnsembleForm, self).clean()
        new_ensemble = cleaned_data.get('name')
        parent = cleaned_data.get('parent')
        slug = slugify(new_ensemble)

        # check if name already exists:
        ensemble = CollectionsEnsemble.objects.filter(
                name=new_ensemble,
                parent=parent,
                slug=slug)
        
        # if get a result so ensemble already exists, raise an error
        if ensemble:
            # define error message
            msg = "L'ensemble de collection est déjà existant"
            # display error message
            self._errors["name"] = self.error_class([msg])
            # delete not cleaned data
            del cleaned_data["name"]

        else:
            # create new ensemble
            CollectionsEnsemble.objects.create(
                    name=new_ensemble,
                    slug=slug,
                    parent=parent)

        # returns data if everything is correct
        return cleaned_data



class RenameCollectionsEnsembleForm(Form):
    """Collections Ensemble renaming form"""
    ensemble = TreeNodeChoiceField(
            queryset=CollectionsEnsemble.objects.all(),
            label="Ensemble à renommer",
            required=True)
    name = forms.CharField(
            max_length=150,
            label="Nouveau nom",
            widget=forms.TextInput(attrs={'required': 'required'}))

    def clean(self):
        cleaned_data = super(RenameCollectionsEnsembleForm, self).clean()
        ensemble = cleaned_data.get('ensemble')
        name = cleaned_data.get('name')
        slug = slugify(name)

        # if no ensemble choosen, raise an error
        if not ensemble:
            # define error message
            msg = "Veuillez choisir l'ensemble à renommer"
            # display error message
            self._errors["ensemble"] = self.error_class([msg])
            # delete not cleaned data
        else:
            # get ensemble parent node
            parents = ensemble.get_ancestors(ascending=True)

            # if not root
            if parents:
                parent = parents[0]
            else:
                parent = None

            # check if new name already exists:
            new_ensemble = CollectionsEnsemble.objects.filter(
                    name=name, parent=parent)

            # if get a result so new name already exists, raise an error
            if new_ensemble:
                # define error message
                msg = "L'ensemble de collection est déjà existant"
                # display error message
                self._errors["name"] = self.error_class([msg])
                # delete not cleaned data
                del cleaned_data["name"]
            else:
                # rename ensemble
                ensemble.name = name
                ensemble.slug = slug
                ensemble.save()

        # returns data if everything is correct
        return cleaned_data



class DeleteCollectionsEnsembleForm(Form):
    """Collections Ensemble deleting form"""
    ensemble = TreeNodeChoiceField(
            queryset=CollectionsEnsemble.objects.all(),
            label="Ensemble à supprimer",
            required=True)

    def clean(self):
        cleaned_data = super(DeleteCollectionsEnsembleForm, self).clean()
        ensemble = cleaned_data.get('ensemble')

        # if no ensemble choosen, raise an error
        if not ensemble:
            # define error message
            msg = "Veuillez choisir l'ensemble à supprimer"
            # display error message
            self._errors["ensemble"] = self.error_class([msg])
            # delete not cleaned data
        else:
            # get ensemble descendant count
            descendant_count = ensemble.get_descendant_count()

            # get ensemble collection count
            collections_count = Collection.objects.filter(
                    ensemble=ensemble).count()

            # if ensemble is not empty, raise an error
            if descendant_count >= 1 or collections_count >= 1:
                # define error message
                msg = "L'ensemble de collection n'est pas vide"
                # display error message
                self._errors["ensemble"] = self.error_class([msg])
                # delete not cleaned data
                del cleaned_data["ensemble"]

            else:
                # delete ensemble
                ensemble.delete()

        # returns data if everything is correct
        return cleaned_data



class CreateCollectionForm(Form):
    """Collection creation form"""
    name = forms.CharField(
            max_length=150,
            label="Nom",
            widget=forms.TextInput(attrs={'required': 'required'}))
    parent = TreeNodeChoiceField(
            queryset=CollectionsEnsemble.objects.all(),
            label="Placer dans un ensemble existant",
            required=False)
    folder = TreeNodeChoiceField(
            queryset=Directory.objects.all(),
            label="Utiliser les images d'un dossier",
            required=False)
    order = forms.ChoiceField(
            choices=PICTURES_ORDERING_CHOICES,
            label="Classement des images par :")
    desc = forms.BooleanField(
            label="Classement décroissant",
            required=False)

    def clean(self):
        cleaned_data = super(CreateCollectionForm, self).clean()
        name = cleaned_data.get('name')
        parent = cleaned_data.get('parent')
        folder = cleaned_data.get('folder')
        order = cleaned_data.get('order')
        desc = cleaned_data.get('desc')
        slug = slugify(name)
        
        # check if collection with same name and parent already exists
        collection = Collection.objects.filter(
                name=name,
                ensemble=parent,
                slug=slug)

        # if get a result so name already exists, raise an error
        if collection:
            # define error message
            msg = "La collection est déjà existante"
            # display error message
            self._errors["name"] = self.error_class([msg])
            # delete not cleaned data
            del cleaned_data["name"]
        else:
            # create new collection
            collection = Collection.objects.create(
                    name=name,
                    slug=slug,
                    ensemble=parent,
                    order=order,
                    reversed_order=desc)
            if folder:
                for item in folder.get_directory_pictures():
                    try:
                        pict = Collection_pictures.objects.get(
                                collection=collection, picture=item)
                    except:
                        pict = Collection_pictures(
                                collection=collection, picture=item)
                        pict.save()
                collection.n_pict = collection.pictures.count()
                collection.save()
        
        # returns data if everything is correct
        return cleaned_data

        
            
class RenameCollectionForm(Form):
    """Collection renaming form"""
    collection = forms.ModelChoiceField(
            queryset=Collection.objects.all(),
            label="Collection à renommer",
            required=True)
    name = forms.CharField(
            max_length=150,
            label="Nouveau nom",
            widget=forms.TextInput(attrs={'required': 'required'}))

    def clean(self):
        cleaned_data = super(RenameCollectionForm, self).clean()
        collection = cleaned_data.get('collection')
        name = cleaned_data.get('name')
        slug = slugify(name)

        # check if collection exists with same name and parent
        new_collection = Collection.objects.filter(
                name=name,
                ensemble=collection.ensemble)

        # if get a result so name already exists, raise an error
        if new_collection:
            # define error message
            msg = "La collection cible est déjà existante"
            # display error message
            self._errors["name"] = self.error_class([msg])
            # delete not cleaned data
            del cleaned_data["name"]
        else:
            collection.name = name
            collection.slug = slug
            collection.save()

        # returns data if everything is correct
        return cleaned_data



class DeleteCollectionForm(Form):
    """Collection deleting form"""
    collection = forms.ModelChoiceField(
            queryset=Collection.objects.all(),
            label="collection à supprimer",
            required=True)

    def clean(self):
        cleaned_data = super(DeleteCollectionForm, self).clean()
        collection = cleaned_data.get('collection')

        # if no ensemble choosen, raise an error
        if not collection:
            # define error message
            msg = "Veuillez choisir l'ensemble à supprimer"
            # display error message
            self._errors["collection"] = self.error_class([msg])
            # delete not cleaned data
        else:
            # get collection picture count
            pictures_count = Picture.objects.filter(
                    collections=collection).count()

            # if ensemble is not empty, raise an error
            if pictures_count >= 1:
                # define error message
                msg = "La collection n'est pas vide"
                # display error message
                self._errors["collection"] = self.error_class([msg])
                # delete not cleaned data
                del cleaned_data["collection"]

            else:
                # delete ensemble
                collection.delete()

        # returns data if everything is correct
        return cleaned_data

    

class CreateTagForm(Form):
    """Tag creation form."""
    name = forms.CharField(
            max_length=30,
            label="Nom",
            widget=forms.TextInput(attrs={'required': 'required'}))

    def clean(self):
        cleaned_data = super(CreateTagForm, self).clean()
        new_tag = cleaned_data.get('name')

        # check if tag already exists with same name
        tag = Tag.objects.filter(name=new_tag)
        # if get a result, tag already exists, raise an error
        if tag:
            # define error message
            msg = "Le mot clé est déjà existant"
            self.errors["name"] = self.error_class([msg])
            del cleaned_data['name']
        else:
            # create new tag
            cleaned_data["object"] = Tag.objects.create(name=new_tag)

        # returns data if everything is correct
        return cleaned_data
            
 

class RenameTagForm(Form):
    """Tag renaming form."""
    tag = forms.ModelChoiceField(
            queryset=Tag.objects.all(),
            label="Mot clé à renommer",
            required=True)
    name = forms.CharField(
            max_length=30,
            label="Nouveau nom",
            widget=forms.TextInput(attrs={'required': 'required'}))

    def clean(self):
        cleaned_data = super(RenameTagForm, self).clean()
        tag = cleaned_data.get('tag')
        name = cleaned_data.get('name')

        # check if tag exists with same name
        new_tag = Tag.objects.filter(name=name)
        # if result, so name already exists, raise an error
        if new_tag:
            msg = "Le mot clé cible est déjà existant"
            self._errors['name'] = self.error_class([msg])
            # delete not cleaned data
            del cleaned_data['name']
        else:
            tag.name = name
            tag.save()
        # returns data if everything is correct
        return cleaned_data

 

class DeleteTagForm(Form):
    """Tag deletion form."""
    tag = forms.ModelChoiceField(
            queryset=Tag.objects.all(),
            label="Mot clé à supprimer",
            required=True)

    def clean(self):
        cleaned_data = super(DeleteTagForm, self).clean()
        tag = cleaned_data.get('tag')

        # if no ta choosen, raise an error
        if not tag:
            msg = "Veuillez choisir le mot clé à supprimer"
            self._errors['tag'] = self.error_class([msg])
        else:
            # delete tag
            tag.delete()

        # returns data if everything is correct
        return cleaned_data

            

class ChoosePostToUpdateForm(Form):
    """Form to choose a blog entry to update"""
    entry = forms.ModelChoiceField(
            queryset=Entry.posts.all(), 
            label="Post à éditer", required=True)
 


class ChoosePostToDeleteForm(Form):
    """Form to choose a blog entry to delete"""
    entry = forms.ModelChoiceField(
            queryset=Entry.posts.all(),
            label="Post à supprimer", required=True)



class ChoosePortfolioToUpdateForm(Form):
    """Form to choose a portfolio to update"""
    entry = forms.ModelChoiceField(queryset=Entry.portfolios.all(),
        label="Portfolio à éditer", required=True)
 


class ChoosePortfolioToDeleteForm(Form):
    """Form to choose a portfolio to delete"""
    entry = forms.ModelChoiceField(queryset=Entry.portfolios.all(),
        label="Portfolio à supprimer", required=True)






