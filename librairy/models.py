#-*- coding: utf-8 -*-
import os
from datetime import datetime

from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.db.models import Q

PICTURES_ORDERING_CHOICES = (
        ('name', 'Nom'),
        ('id', 'ID'),
        ('date', 'Date de création'),
        ('date_import', 'Date d\'importation'),
        ('date_update', 'Date de mise à jour'),
        ('custom', 'Personnalisé'),
        ('type', 'Type de fichier'),
        ('title', 'Titre'),
        ('lens', 'Objectif'),
        ('camera', 'Boîtier'),
        ('aperture', 'Diaphragme'),
        ('speed', 'Vitesse d\'obturation'),
        ('size', 'Poids'),
        ('note', 'Note'),
    )

def ancestors2list(ancestors):
    """Transform ancestors from mptt tree into list of element names.

    keyword argument:
    ancestors -- mptt ancestors object
    
    return: ordered list of ancestors name (list of strings)
    
    """
    ancestors_list = []
    for elem in ancestors:
        ancestors_list.append(elem.name)
    
    return ancestors_list



class Picture(models.Model):
    """Pictures table"""
    title = models.CharField(max_length=140, null=True, blank=True, verbose_name="Titre")
    legend = models.TextField(null=True, blank=True, verbose_name="Légende")
    name_import = models.CharField(max_length=140, verbose_name="Nom à l'importation")
    name_origin = models.CharField(max_length=140, verbose_name="Nom original")
    name = models.CharField(max_length=140, verbose_name="Nom")
    directory = models.ForeignKey('Directory', verbose_name="Dossier")
    type = models.CharField(max_length=30, verbose_name="Type")
    size = models.PositiveIntegerField(verbose_name="Poids")
    width = models.PositiveIntegerField(verbose_name="Largeur")
    height = models.PositiveIntegerField(verbose_name="Hauteur")
    color = models.BooleanField(default=True, verbose_name="Couleur")
    camera = models.CharField(max_length=140, null=True, blank=True, verbose_name="Appareil photo")
    lens = models.CharField(max_length=140, null=True, blank=True, verbose_name="Objectif")
    speed = models.CharField(max_length=30, null=True, blank=True, verbose_name="Vitesse d'obturation")
    aperture = models.CharField(max_length=30, null=True, blank=True, verbose_name="Diaphragme")
    iso = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Sensibilité iso")
    tags = models.ManyToManyField('Tag', null=True, blank=True, verbose_name="Mots clés")
    note = models.PositiveSmallIntegerField(default=0, verbose_name="Note")
    label= models.ForeignKey('Label', verbose_name="Libellé", null=True, blank=True)
    licence = models.ForeignKey('Licence', verbose_name="License", null=True, blank=True)
    md5 = models.CharField(max_length=300, verbose_name="Somme de contrôle")
    n_read = models.PositiveIntegerField(default=0, verbose_name="Nombre de lectures")
    date_import = models.DateTimeField(auto_now_add=True, auto_now=False, verbose_name="Date d'importation")
    date_update = models.DateTimeField(auto_now_add=True, auto_now=True, verbose_name="Date de mise àà jour")
    date_origin = models.DateTimeField(auto_now_add=False, auto_now=False, null=True, blank=True, verbose_name="Date d'origine")
    date = models.DateTimeField(auto_now_add=False, auto_now=False, null=True, blank=True, verbose_name="Date")

    class Meta:
        unique_together = ('directory', 'name')
        ordering = ['name']

    def __str__(self):
        return "id: %s, %s" % (self.id, self.name)

    def get_relative_pathname(self):
        """Returns picture pathname relative to LIBRAIRY"""
        ancestors = self.directory.get_ancestors(include_self=True)
        ancestors_path = '/' + '/'.join(ancestors2list(ancestors)) + '/'
        return (os.path.join(ancestors_path, self.name))

class Directory(MPTTModel):
    """Directorys table"""
    name = models.CharField(max_length=150, verbose_name="Nom")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    parent = TreeForeignKey('self', null=True, blank=True, related_name="Children")

    def get_directory_pictures(self):
        """Return all pictures of a directory and its sub directorys."""
        # if directory is leaf node, return query
        if self.is_leaf_node():
            return Picture.objects.filter(directory__id=self.id)
        # if not, search for descandants
        # select directory descendants
        directory_descendants = self.get_descendants(include_self=True)
        # set Q objects list with descandants
        queries = [Q(directory__id=item.id) for item in directory_descendants]
        # Take a Q object from the list
        query = queries.pop()
        # Paste Q object with the ones remaining in the list
        for item in queries:
            query |= item
        # return queryset
        return Picture.objects.filter(query)
        

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

class Tag(MPTTModel):
    """Tags table"""
    name = models.CharField(max_length=150, verbose_name="Nom")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    parent = models.ForeignKey('Tag', null=True, blank=True)

    class Meta:
        unique_together = ('parent', 'name')
        ordering = ['name']

    def __str__(self):
        return self.name

class Label(models.Model):
    """Labels table"""
    name = models.CharField(max_length=150, verbose_name="Nom")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    color = models.CharField(max_length=7, default="#CB5151", verbose_name="Couleur")
    # colors:
    # #CB5151 -> rouge
    # #C5C42E -> jaune
    # #4CAA51 -> vert
    # #4B7CC9 -> bleu
    # #7E56CB -> violet

    def __str__(self):
        return self.name

class Licence(models.Model):
    """Licences table"""
    name = models.CharField(max_length=150, null=True, blank=True, verbose_name="Nom")
    slug = models.SlugField(max_length=150, null=True, blank=True, verbose_name="slug")
    state = models.CharField(max_length=30, null=True, blank=True, verbose_name="État du copyright")
    copyright = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True, verbose_name="Description")
    url = models.URLField(verbose_name="URL", null=True, blank=True)


    def __str__(self):
        return self.name

class Collection(models.Model):
    """Collections table"""
    name = models.CharField(max_length=150, verbose_name="Collection")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    ensemble = models.ForeignKey('CollectionsEnsemble', null=True, blank=True)
    pictures = models.ManyToManyField(Picture, through='Collection_pictures', null=True, blank=True, verbose_name="Images")
    n_pict = models.PositiveIntegerField(default=0, verbose_name="Nombre d'images")
    order = models.CharField(max_length=150, null=True, blank=True, default='name',
            choices=PICTURES_ORDERING_CHOICES, verbose_name="Ordre")
    reversed_order = models.BooleanField(default=False, verbose_name="Classement décroissant")

    @property
    def get_sorted_pictures(self):
        """Returns Picture objects queryset order by 'self.order'
        and reversed if 'self.reversed_order'"""
        if self.order == 'custom':
            return [collection.picture for collection in
                    Collection_pictures.objects.filter(collection=self)
                    .order_by('order')]
        else:
            order = self.order
            if self.reversed_order:
                order = '-' + self.order
            return self.pictures.order_by(order)

    class Meta:
        unique_together = ('name', 'ensemble')

    def __str__(self):
        return self.name

class Collection_pictures(models.Model):
    """Through class for collection's pictures relation, add order column"""
    collection = models.ForeignKey(Collection)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ('order',)

class CollectionsEnsemble(MPTTModel):
    """Collections ensembles table"""
    name = models.CharField(max_length=150, verbose_name="Ensemble de collection")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    parent = models.ForeignKey('CollectionsEnsemble', null=True, blank=True)

    def get_pictures(self):
        """Return all pictures of a collection ensembles."""
        # select ensemble descendants
        ensemble_descendants = self.get_descendants(include_self=True)

        collections_list = []
        # for each descendant of ensemble append children collections to list
        for descendant in ensemble_descendants:
            collections = Collection.objects.filter(ensemble=descendant)
            if collections:
                for collection in collections:
                    collections_list.append(collection)

        # set Q objects list with collections_list
        queries = [Q(collections__id=collection.id) for collection in collections_list]
        # Take one Q object from the list
        query = queries.pop()
        # Or the Q object with the ones remaining in the list
        for item in queries:
            query |= item

        # return queryset
        return Picture.objects.filter(query)

    class Meta:
        unique_together = ('name', 'parent')

    def __str__(self):
        return self.name

