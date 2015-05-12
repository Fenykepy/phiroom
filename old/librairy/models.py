#-*- coding: utf-8 -*-
import os
import time
import logging
from datetime import datetime

from wand.image import Image
from PIL import Image as PilImage

from django.db import models
from django.db.models import Q
from django.template.defaultfilters import slugify

from mptt.models import MPTTModel, TreeForeignKey

from librairy.xmpinfo import XmpInfo

from conf.models import Conf
from phiroom.settings import LIBRAIRY_URL, LIBRAIRY, PREVIEWS_DIR, \
        LARGE_PREVIEWS_SIZE_CHOICES, PREVIEWS_CROP, PREVIEWS_MAX, \
        PREVIEWS_WIDTH, PREVIEWS_HEIGHT, LARGE_PREVIEWS_FOLDER, \
        LARGE_PREVIEWS_QUALITY
from thumbnail import ThumbnailFactory

#logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.DEBUG)

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


def create_tag_hierarchy(tags):
    """Function to create a hierarchy of tags in db.

    keyword argument:
    tags -- list of tuple containing hierarchical keywords
        (givent by XmapInfo.get_hierarchical_keywords())

    return: list of leafs tags
    """
    leafs = []
    for elem in tags:
        # initialise parent with None (to start from root tag)
        parent = None
        index_end = len(elem) - 1
        for index, tag in enumerate(elem):
            parent, created = Tag.objects.get_or_create(
                    name=tag,
                    slug=slugify(tag), parent=parent)

            # if we get a leaf tag
            if index == index_end:
                leafs.append(parent)

    return leafs



def get_or_create_directory(dirpath):
    """test if given directory exists, create it if necessary."""
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)



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
    title = models.CharField(max_length=140, null=True, blank=True,
            verbose_name="Titre")
    legend = models.TextField(null=True, blank=True, verbose_name="Légende")
    name_import = models.CharField(max_length=140,
            verbose_name="Nom à l'importation")
    name_origin = models.TextField(verbose_name="Nom original")
    name = models.TextField(verbose_name="Nom")
    directory = models.ForeignKey('Directory', verbose_name="Dossier")
    type = models.CharField(max_length=30, verbose_name="Type")
    size = models.PositiveIntegerField(verbose_name="Poids")
    width = models.PositiveIntegerField(verbose_name="Largeur")
    height = models.PositiveIntegerField(verbose_name="Hauteur")
    landscape = models.BooleanField(default=True,
            verbose_name="Orientation paysage")
    color = models.BooleanField(default=True, verbose_name="Couleur")
    camera = models.CharField(max_length=140, null=True, blank=True,
            verbose_name="Appareil photo")
    lens = models.CharField(max_length=140, null=True, blank=True,
            verbose_name="Objectif")
    speed = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="Vitesse d'obturation")
    aperture = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="Diaphragme")
    iso = models.PositiveSmallIntegerField(null=True, blank=True,
            verbose_name="Sensibilité iso")
    tags = models.ManyToManyField('Tag', null=True, blank=True,
            verbose_name="Mots clés", related_name="tags")
    note = models.PositiveSmallIntegerField(default=0, verbose_name="Note")
    label= models.ForeignKey('Label', verbose_name="Libellé", null=True,
            blank=True)
    licence = models.ForeignKey('Licence', verbose_name="License",
            null=True, blank=True)
    md5 = models.TextField(verbose_name="Somme de contrôle")
    n_read = models.PositiveIntegerField(default=0,
            verbose_name="Nombre de lectures")
    date_import = models.DateTimeField(auto_now_add=True, auto_now=False,
            verbose_name="Date d'importation")
    date_update = models.DateTimeField(auto_now_add=True, auto_now=True,
            verbose_name="Date de mise àà jour")
    date_origin = models.DateTimeField(auto_now_add=False, auto_now=False,
            null=True, blank=True, verbose_name="Date d'origine")
    date = models.DateTimeField(auto_now_add=False, auto_now=False,
            null=True, blank=True, verbose_name="Date")
    absolute_url = models.URLField()


    class Meta:
        unique_together = ('directory', 'name')
        ordering = ['name']


    def __str__(self):
        return "id: {}, {}".format(self.id, self.name)


    def get_relative_pathname(self):
        """Returns picture pathname relative to LIBRAIRY"""
        ancestors = self.directory.get_ancestors(include_self=True)
        ancestors_path = '/' + '/'.join(ancestors2list(ancestors)) + '/'
        return (os.path.join(ancestors_path, self.name))


    def is_part_of_portfolio(self):
        """Returns True if picture is part of at list one portfolio."""
        if self.entry_set.filter(portfolio=True):
            return True
        return False


    def is_part_of_blogpost(self):
        """Returns True if picture is part of at list one blogpost."""
        if self.entry_set.filter(portfolio=False):
            return True
        return False

    def load_metadatas(self):
        """Loads metadatas from picture and save them in db."""
        i = time.time()
        pathname = os.path.join(LIBRAIRY, self.get_relative_pathname().lstrip('/'))
        # we use Pil here to read format, width and height of image because wand
        # loads all image in memory to read them and it's slow (0.5s arround with wand
        # against less than 0.2 with Pil for a Canon 5DIII full size picture)
        img = PilImage.open(pathname)
        self.width, self.height = img.size
        self.type = img.format
        if self.height > self.width:
            self.landscape = False
        # delete picture object
        del img
        j = time.time()

        # load xmp object
        xmp = XmpInfo(pathname)
        k = time.time()

        self.title = xmp.get_title()[:140]
        self.legend = xmp.get_legend()
        self.size = os.path.getsize(pathname)
        self.camera = xmp.get_camera()[:140]
        self.lens = xmp.get_lens()[:140]
        self.speed = xmp.get_speed()[:30]
        self.aperture = xmp.get_aperture()[:30]
        self.iso = xmp.get_iso()
        self.note = xmp.get_rate()
        label = xmp.get_label()[:150]
        if label:
            label, created = Label.objects.get_or_create(
                    name=label,
                    slug=slugify(label))
            self.label = label
        copyright = xmp.get_copyright()
        copyright_state = xmp.get_copyright_state()
        copyright_description = xmp.get_usage_terms()
        copyright_url = xmp.get_copyright_url()
        # get or create licence (without name and slug (not in xmp))
        licence, created = Licence.objects.get_or_create(
                state=copyright_state,
                copyright=copyright,
                description=copyright_description,
                url=copyright_url)
        self.licence = licence
        self.date_origin = xmp.get_date_origin()
        self.date = xmp.get_date_created()
        l = time.time()
        # save image in db
        self.save()
        m = time.time()
        # add m2m relations
        hierarchical_tags = xmp.get_hierarchical_keywords()
        if hierarchical_tags:
            tags = create_tag_hierarchy(hierarchical_tags)
            for tag in tags:
                self.tags.add(tag)
        else:
            tags = xmp.get_keywords()
            for elem in tags:
                tag, created = Tag.objects.get_or_create(
                        name=elem,
                        slug=slugify(elem),
                        parent=None)
                self.tags.add(tag)
        n = time.time()
        logging.info('Metadatas loaded in {}s.'.format(n - i))
        logging.info('IMG loaded in {}s.'.format(j - i))
        logging.info('xmp object created in {}s.'.format(k - j))
        logging.info('metadatas read in {}s.'.format(l - k))
        logging.info('metadatas read in {}s.'.format(l - k))
        logging.info('object saved in {}s.'.format(m - l))
        logging.info('hieararchical tags loaded in {}s.'.format(n - m))
        

    
    def delete_previews(self):
        """Delete previews file."""
        # preview filename
        filename = "{}.jpg".format(self.id)
        # search for previews directorys
        for file in os.listdir(PREVIEWS_DIR):
            # if file is a directory
            if os.path.isdir(os.path.join(PREVIEWS_DIR, file)):
                try:
                    # remove file from directory
                    os.remove(os.path.join(PREVIEWS_DIR, file, filename))
                except FileNotFoundError:
                    pass

    def delete_picture(self):
        """Delete original picture file."""
        try:
            os.remove(os.path.join(LIBRAIRY,
                self.get_relative_pathname().strip('/')))
        except FileNotFoundError:
            pass


    def generate_previews(self):
        "Create thumbs for the picture."""
        # we use wand to generate previews because Pil sucks with colors.
        preview_name = "{}.jpg".format(self.id)
        source_pathname = os.path.join(LIBRAIRY,
                self.get_relative_pathname().strip('/'))
        i = time.time()
        conf = Conf.objects.latest()
        j = time.time()
        logging.info('latest conf object loaded in {}s.'.format(j - i))
        MAX = []
        # if original is smaller than large preview size or 
        # if large preview size is full size, symlink original
        if (conf.large_previews_size == 0 or (
                self.width < conf.large_previews_size and
                self.height < conf.large_previews_size)):
            preview_path = os.path.join(PREVIEWS_DIR, LARGE_PREVIEWS_FOLDER)
            preview_pathname = os.path.join(preview_path, preview_name)
            get_or_create_directory(preview_path)
            os.symlink(source_pathname, preview_pathname)
        # else add large preview size to PREVIEWS_MAX
        else:
            MAX.append(
                    (
                        LARGE_PREVIEWS_QUALITY,
                        LARGE_PREVIEWS_FOLDER,
                        conf.large_previews_size,
                    )
            )
        MAX.extend(PREVIEWS_MAX)



        i = time.time()
        # generate max side based previews from bigger to smaller
        with ThumbnailFactory(filename=source_pathname) as img:
            for preview in MAX:
                k = time.time()
                quality = preview[0]
                preview_path = os.path.join(PREVIEWS_DIR, preview[1])
                preview_pathname = os.path.join(preview_path, preview_name)
                max_side = preview[2]
                get_or_create_directory(preview_path)

                img.resize_max(max_side)
                img.save(filename=preview_pathname, format="pjpeg",
                        quality=quality)
                l = time.time()
                logging.info('{} max preview generated in {}.'.format(
                    preview[2], l - k))
            l = time.time()
            logging.info('max previews generated in {}.'.format(l - i))

        # generate width based previews from bigger to smaller
        m = time.time()
        with ThumbnailFactory(filename=source_pathname) as img:
            for preview in PREVIEWS_WIDTH:
                quality = preview[0]
                preview_path = os.path.join(PREVIEWS_DIR, preview[1])
                preview_pathname = os.path.join(preview_path, preview_name)
                width = preview[2]
                get_or_create_directory(preview_path)

                img.resize_width(width)
                img.save(filename=preview_pathname, format="pjpeg",
                    quality=quality)
        n = time.time()
        logging.info('width previews generated in {}s.'.format(n - m))

        # generate height based previews from bigger to smaller
        m = time.time()
        with ThumbnailFactory(filename=source_pathname) as img:
            for preview in PREVIEWS_HEIGHT:
                quality = preview[0]
                preview_path = os.path.join(PREVIEWS_DIR, preview[1])
                preview_pathname = os.path.join(preview_path, preview_name)
                height = preview[2]
                get_or_create_directory(preview_path)

                img.resize_height(height)
                img.save(filename=preview_pathname, format="pjpeg",
                        quality=quality)
        n = time.time()
        logging.info('height previews generated in {}s.'.format(n - m))

        # generate height and width based previews from full size each time
        m = time.time()
        for preview in PREVIEWS_CROP:
            quality = preview[0]
            preview_path = os.path.join(PREVIEWS_DIR, preview[1])
            preview_pathname = os.path.join(preview_path, preview_name)
            width = preview[2]
            height = preview[3]
            get_or_create_directory(preview_path)

            with ThumbnailFactory(filename=source_pathname) as img:
                img.resize_crop(width, height)
                img.save(filename=preview_pathname, format="pjpeg",
                    quality=quality)

        j = time.time()
        logging.info('crop previews generated in {}s.'.format(j - m))
        logging.info('previews generated in {}s.'.format(j - i))


    def save(self, **kwargs):
        """Get absolute url then save"""
        self.absolute_url = LIBRAIRY_URL + self.get_relative_pathname()
        super(Picture, self).save()



class Directory(MPTTModel):
    """Directorys table"""
    name = models.CharField(max_length=150, verbose_name="Nom")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    parent = TreeForeignKey('self', null=True, blank=True,
            related_name="Children")

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
    color = models.CharField(max_length=7, default="#CB5151",
            verbose_name="Couleur")
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
    name = models.CharField(max_length=150, null=True, blank=True,
            verbose_name="Nom")
    slug = models.SlugField(max_length=150, null=True, blank=True,
            verbose_name="slug")
    state = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="État du copyright")
    copyright = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True,
            verbose_name="Description")
    url = models.URLField(verbose_name="URL", null=True, blank=True)


    def __str__(self):
        return self.name



class Collection(models.Model):
    """Collections table"""
    name = models.CharField(max_length=150, verbose_name="Collection")
    slug = models.SlugField(max_length=150, verbose_name="slug")
    ensemble = models.ForeignKey('CollectionsEnsemble', null=True, blank=True)
    pictures = models.ManyToManyField(Picture, through='Collection_pictures',
            null=True, blank=True, verbose_name="Images")
    n_pict = models.PositiveIntegerField(default=0,
            verbose_name="Nombre d'images")
    order = models.CharField(max_length=150, null=True, blank=True,
            default='name', choices=PICTURES_ORDERING_CHOICES,
            verbose_name="Ordre")
    reversed_order = models.BooleanField(default=False,
            verbose_name="Classement décroissant")

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

