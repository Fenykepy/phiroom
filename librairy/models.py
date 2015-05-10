import os

from django.db import models
from django.core.files.storage import FileSystemStorage

from mptt.models import MPTTModel, TreeForeignKey

from phiroom.settings import LIBRAIRY, PREVIEWS_DIR, \
        PREVIEWS_CROP, PREVIEWS_MAX, PREVIEWS_HEIGHT, \
        PREVIEWS_WIDTH, LARGE_PREVIEWS_FOLDER, \
        LARGE_PREVIEWS_QUALITY

from librairy.xmpinfo import XmpInfo

from thumbnail import ThumbnailFactory


class PictureFileSystemStorage(FileSystemStorage):
    def get_available_name(self, name):
        return name

    def _save(self, name, content):
        if self.exists(name):
            # if the file exists, do not call the superclasses _save method
            return name
        # if the file is new, DO call it
        return super(PictureFileSystemStorage, self)._save(name, content)



def set_picturename(instance, filename):
    """Set pathname under form
    full/4a/52/4a523fe9c50a2f0b1dd677ae33ea0ec6e4a4b2a9.ext."""
    return os.path.join(
            LIBRAIRY,
            instance.sha1[0:2],
            instance.sha1[2:4],
            instance.sha1 + '.' + instance.type
    )




class Picture(models.Model):
    """Table for all pictures."""
    importation_date = models.DateTimeField(auto_now_add=True,
            verbose_name="Importation date")
    last_update = models.DateTimeField(auto_now=True,
            verbose_name="Last update date")
    sha1 = models.CharField(max_length=42, unique=True, db_index=True)
    source_file = models.ImageField(upload_to=set_picturename,
            storage=PictureFileSystemStorage()
    )
    directory = models.ForeignKey('Directory', verbose_name="Folder")
    title = models.CharField(max_length=140, null=True, blank=True,
            verbose_name="Title")
    legend = models.TextField(null=True, blank=True,
            verbose_name="Legend")
    name_import = models.CharField(max_length=140,
            verbose_name="Importation name")
    name = models.CharField(max_length=140,
            verbose_name="Name")
    type = models.CharField(max_length=30, verbose_name="File type")
    weight = models.PositiveIntegerField(verbose_name="File weight")
    width = models.PositiveIntegerField(verbose_name="File width")
    height = models.PositiveIntegerField(verbose_name="File height")
    # false if landscape or square
    portrait_orientation = models.BooleanField(
            verbose_name="Portrait orientation")
    # false if portrait or square
    landscape_orientation = models.BooleanField(
            verbose_name="Landscape orientation")
    color = models.BooleanField(default=True, verbose_name="Color picture")
    camera = models.CharField(max_length=300, null=True, blank=True,
            verbose_name="Camera model")
    lens = models.CharField(max_length=300, null=True, blank=True,
            verbose_name="Lens model")
    speed = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="Shutter speed")
    aperture = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="Aperture")
    iso = models.PositiveSmallIntegerField(null=True, blank=True,
            verbose_name="Iso sensibility")
    tags = models.ManyToManyField('PicturesTag', null=True, blank=True,
            verbose_name="Keywords")
    label= models.ForeignKey('Label',null=True, blank=True,
            verbose_name="Label")
    rate = models.PositiveSmallIntegerField(default=0,
            verbose_name="Rating")
    exif_date = models.DateTimeField(auto_now_add=False, auto_now=False,
        null=True, blank=True, verbose_name="Exif date")
    exif_origin_date = models.DateTimeField(auto_now_add=False,
            auto_now=False, null=True, blank=True,
            verbose_name="Exif origin date")
    copyright = models.CharField(max_length=300, null=True, blank=True)
    copyright_state = models.CharField(max_length=30, null=True,
            blank=True, verbose_name="Copyright state")
    copyright_description = models.TextField(null=True, blank=True,
            verbose_name="Copyright description")
    copyright_url = models.URLField(null=True, blank=True,
            verbose_name="Copyright url")

    class Meta:
        ordering = ['importation_date']


    def _set_previews_filename(self):
        """Create preview filename from sha1."""
        return '{}.jpg'.format(self.sha1)


    def _set_previews_subdirs(self):
        """Create previews path with two subdirectorys from sha1."""
        return '{}/{}/'.format(
                self.sha1[0:2],
                self.sha1[2:4]
        )

    def load_metadatas(self):
        """Loads metadatas from picture file and store them in db."""


    def generate_previews(self):
        """Create thumbnails for picture."""
        # we use wand to generate previews because Pillow sucks with colors.
        preview_name = "{}.jpg"






class PicturesTag(models.Model):
    """Table for all pictures."""
    name = models.CharField(max_length=150, unique=True,
            verbose_name="Name")
    slug = models.SlugField(max_length=150, db_index=True, unique=True,
            verbose_name="Slug")

    def __str__(self):
        return self.name



class Label(models.Model):
    """Table for all labels."""
    name = models.CharField(max_length=150, verbose_name="Name")
    slug = models.SlugField(max_length=150, verbose_name="Slug")
    color = models.CharField(max_length=7, default="#CB5151",
            verbose_name="Color")

    def __str__(self):
        return self.name




    
class Directory(MPTTModel):
    """Table for all directorys."""
    name = models.CharField(max_length=150, verbose_name="Name")
    slug = models.SlugField(max_length=150, verbose_name="Slug")
    parent = TreeForeignKey('self', null=True, blank=True,
            related_name="Children")

    def get_children_pictures(self):
        """Returns all pictures of a directory and its sub directorys."""
        # if dir is leaf node, return query
        if self.is_leaf_node():
            return self.pictures.all()
        # if not, search descendants
        dir_descendants = self.get_descendants(include_self=True)


    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name
    


class Collection(models.Model):
    """Table for all collections"""
    name = models.CharField(max_length=150, verbose_name="Collection")
    slug = models.SlugField(max_length=150, verbose_name="Slug")
    ensemble = models.ForeignKey('CollectionsEnsemble', null=True,
            blank=True)
    pictures = models.ManyToManyField(Picture,
            through='Collection_pictures', null=True, blank=True,
            verbose_name="Pictures")
    n_pict = models.PositiveIntegerField(default=0,
            verbose_name="Pictures number")

    @property
    def get_sorted_pictures(self):
        """Returns collection's pictures ordered"""
        return [collection.picture for collection in
                Collection_pictures.objects.filter(collection=self)
                .order_by('order')]

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
    name = models.CharField(max_length=150,
            verbose_name="Ensemble de collection")
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

    
