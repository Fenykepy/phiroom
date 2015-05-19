import os

from PIL import Image

from django.db import models
from django.core.files.storage import FileSystemStorage
from django.http import Http404
from django.core.files.images import ImageFile
from django.template.defaultfilters import slugify


from mptt.models import MPTTModel, TreeForeignKey
from thumbnail import ThumbnailFactory

from phiroom.settings import MEDIA_ROOT, LIBRAIRY, PREVIEWS_DIR, \
        PREVIEWS_CROP, PREVIEWS_MAX, PREVIEWS_HEIGHT, \
        PREVIEWS_WIDTH, LARGE_PREVIEWS_FOLDER, \
        LARGE_PREVIEWS_QUALITY

from librairy.xmpinfo import XmpInfo
from librairy.utils import get_sha1_hexdigest
from conf.models import Conf


def create_tag_hierarchy(tags):
    """Function to create a hierarchy of tags in db.
    keyword argument:
    tags -- list of tuple containing hierarchical keywords
    (given by XmapInfo.get_hierarchical_keywords())

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
    """
    Set picture's pathname under form
    <librairy>/4a/52/4a523fe9c50a2f0b1dd677ae33ea0ec6e4a4b2a9.ext.
    """
    return os.path.join(LIBRAIRY, instance._set_subdirs(),
                instance.sha1 + "." + instance.type
            )



class Picture(models.Model):
    """Table for all pictures."""
    importation_date = models.DateTimeField(auto_now_add=True,
            verbose_name="Importation date")
    last_update = models.DateTimeField(auto_now=True,
            verbose_name="Last update date")
    sha1 = models.CharField(max_length=42)
    source_file = models.ImageField(upload_to=set_picturename,
            storage=PictureFileSystemStorage()
    )
    previews_path = models.CharField(max_length=254,
            blank=True, null=True)
    directory = models.ForeignKey('Directory', verbose_name="Folder",
            null=True, blank=True)
    title = models.CharField(max_length=140, null=True, blank=True,
            verbose_name="Title")
    legend = models.TextField(null=True, blank=True,
            verbose_name="Legend")
    name_import = models.CharField(max_length=140,
            verbose_name="Importation name")
    name = models.CharField(max_length=140,
            verbose_name="Name")
    type = models.CharField(max_length=30, null=True, blank=True,
            verbose_name="File type")
    weight = models.PositiveIntegerField(null=True, blank=True,
            verbose_name="File weight")
    width = models.PositiveIntegerField(null=True, blank=True,
            verbose_name="File width")
    height = models.PositiveIntegerField(null=True, blank=True,
            verbose_name="File height")
    # false if landscape or square
    portrait_orientation = models.BooleanField(default=False,
            verbose_name="Portrait orientation")
    # false if portrait or square
    landscape_orientation = models.BooleanField(default=False,
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
    tags = models.ManyToManyField('Tag', blank=True,
            verbose_name="Keywords")
    label= models.ForeignKey('Label', null=True, blank=True,
            verbose_name="Label")
    rate = models.PositiveSmallIntegerField(default=0, null=True,
            blank=True, verbose_name="Rating")
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
        get_latest_by = 'importation_date'



    def _set_subdirs(self):
        """Create path with two subdirectorys named from sha1."""
        return '{}/{}/'.format(
                self.sha1[0:2],
                self.sha1[2:4]
        )



    def _get_pathname(self):
        """Returns absolute pathname of picture'source like :
        <LIBRAIRY>/4a/52/4a523fe9c50a2f0b1dd677ae33ea0ec6e4a4b2a9.ext.
        """
        print(self.source_file.name)
        return os.path.join(MEDIA_ROOT, self.source_file.name)



    def load_metadatas(self):
        """Loads metadatas from picture file and store them in db."""
        source_pathname = self._get_pathname()

        if self.height > self.width:
            self.portrait_orientation = True
        elif self.width > self.height:
            self.landscape_orientation = True

        # load XMP object
        xmp = XmpInfo(source_pathname)

        self.title = xmp.get_title()[:140]
        self.legend = xmp.get_legend()
        self.camera = xmp.get_camera()[:140]
        self.lens = xmp.get_lens()[:140]
        self.speed = xmp.get_speed()[:30]
        self.aperture = xmp.get_aperture()[:30]
        self.iso = xmp.get_iso()
        self.rate = xmp.get_rate()
        label = xmp.get_label()[:150]
        if label:
            # get or create label
            label, created = Label.objects.get_or_create(
                    name=label,
                    slug=slugify(label)
            )
            self.label = label
        self.copyright = xmp.get_copyright()
        self.copyright_state = xmp.get_copyright_state()
        self.copyright_description = xmp.get_usage_terms()
        self.copyright_url = xmp.get_copyright_url()
        self.exif_origin_date = xmp.get_date_origin()
        self.exif_date = xmp.get_date_created()
        # save metadatas in db
        self.save()
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
                        parent=None
                )
                self.tags.add(tag)



    def generate_previews(self):
        """Create thumbnails for picture."""
        # we use wand to generate previews because Pillow sucks with colors.
        # set preview name
        filename = "{}.jpg".format(self.sha1)
        subdirs = self._set_subdirs()
        source_pathname = self._get_pathname()
        self.previews_path = os.path.join(subdirs, filename)
        self.save()
        resize_max = []
        # !!! use cache here
        conf = Conf.objects.latest()

        def mk_subdirs(main_subdir_name):
            """
            create preview subdirs if they don't exist.
            return full preview pathname.
            """
            destination_path = os.path.join(
                    PREVIEWS_DIR,
                    main_subdir_name,
                    subdirs
            )
            if not os.path.exists(destination_path):
                os.makedirs(destination_path)
            # def destination pathname
            return os.path.join(destination_path, filename)

        # if original is smaller than larg preview size
        # or if large preview size equal original, symlink it
        if (conf.large_previews_size == 0 or (
                self.width < conf.large_previews_size and
                self.height < conf.large_previews_size)):
            preview_pathname = mk_subdirs(LARGE_PREVIEWS_FOLDER)
            os.symlink(source_pathname, preview_pathname)
        # else add large preview to PREVIEWS_MAX
        else:
            resize_max.append(
                    (
                        LARGE_PREVIEWS_QUALITY,
                        LARGE_PREVIEWS_FOLDER,
                        conf.large_previews_size,
                    )
            )
        resize_max.extend(PREVIEWS_MAX)


        # generate width based previews
        width_source = source_pathname
        last_width = 1000000
        for preview in PREVIEWS_WIDTH:
            ## preview[0] -- int JPEG quality
            ## preview[1] -- string name of subfolder
            ## preview[2] -- int width of preview
            
            # mk subdirs if necessary
            destination = mk_subdirs(preview[1])
            # check if previous generated preview is enought big
            if preview[2] > last_max_side:
                width_source = source_pathname
            # create thumbnail
            with ThumbnailFactory(filename=width_source) as img:
                img.resize_width(preview[2])
                img.save(filename=destination,
                        format='pjpeg',
                        quality=preview[0]
                )
            # set just created preview as source for next one (faster)
            width_source = destination
            last_width = preview[2]


        # generate height based previews
        height_source = source_pathname
        last_height = 1000000
        for preview in PREVIEWS_HEIGHT:
            ## preview[0] -- int JPEG quality
            ## preview[1] -- string name of subfolder
            ## preview[2] -- int height of preview
            
            # mk subdirs if necessary
            destination = mk_subdirs(preview[1])
            # check if previous generated preview is enought big
            if preview[2] > last_height:
                height_source = source_pathname

            # create thumbnail
            with ThumbnailFactory(filename=height_source) as img:
                img.resize_height(preview[2])
                img.save(filename=destination,
                        format='pjpeg',
                        quality=preview[0]
                )
            # set just created preview as source for next one (faster)
            height_source = destination
            last_height = preview[2]


        # generate max side based previews
        max_source = source_pathname
        last_max_side = 1000000
        for preview in resize_max:
            ## preview[0] -- int JPEG quality
            ## preview[1] -- string name of subfolder
            ## preview[2] -- int largest side of preview
            
            # mk subdirs if necessary
            destination = mk_subdirs(preview[1])
            # check if previous generated preview is enought big
            if preview[2] > last_max_side:
                max_source = source_pathname
            # create thumbnail
            with ThumbnailFactory(filename=max_source) as img:
                img.resize_max(preview[2])
                img.save(filename=destination,
                        format='pjpeg',
                        quality=preview[0]
                )
            # set just created preview as source for next one (faster)
            max_source = destination
            last_max_side = preview[2]


        # generate width and height based previews
        crop_source = source_pathname
        last_crop_width = 1000000
        last_crop_height = 1000000
        for preview in PREVIEWS_CROP:
            ## preview[0] -- int JPEG quality
            ## preview[1] -- string name of subfolder
            ## preview[2] -- int width of preview
            ## preview[3] -- int height of preview
            
            # mk subdirs if necessary
            destination = mk_subdirs(preview[1])
            # check if previous generated preview is enought big
            if preview[2] > last_crop_width or preview[3] > last_crop_height:
                crop_source = source_pathname
            # create thumbnail
            with ThumbnailFactory(filename=crop_source) as img:
                img.resize_crop(preview[2], preview[3])
                img.save(filename=destination,
                        format='pjpeg',
                        quality=preview[0]
                )
            # set just created preview as source for next one (faster)
            crop_source = destination
            last_crop_width = preview[2]
            last_crop_height = preview[3]



    def delete_previews(self):
        """Delete previews file."""
        # search for previews directorys
        for file in os.listdir(PREVIEWS_DIR):
            # if file is a directory
            if os.path.isdir(os.path.join(PREVIEWS_DIR, file)):
                try:
                    # remove file from directory
                    os.remove(os.path.join(PREVIEWS_DIR, file,
                        self.previews_path)
                    )
                except FileNotFoundError:
                    pass



    def delete_picture(self):
        """Delete original picture file."""
        try:
            os.remove(self._get_pathname())
        except FileNotFoundError:
            pass



class Tag(MPTTModel):
    """Table for all tags."""
    name = models.CharField(max_length=150, unique=True,
            verbose_name="Name")
    slug = models.SlugField(max_length=150, db_index=True, unique=True,
            verbose_name="Slug")
    parent = models.ForeignKey('Tag', null=True, blank=True)

    class Meta:
        unique_together = ('parent', 'name')
        ordering = ['name']

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
            through='Collection_pictures', blank=True,
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




class PictureFactory(object):
    """Class to create new pictures objects."""

    def __init__(self, file=None, directory_id=None):
        """
        Make a picture object from given file.
        file: pathname. It MUST be an image file.
        directory: directory id.
        """
        self.picture = Picture()
        if not os.path.isfile(file):
            raise Http404
        self.pathname = file
        self.picture.name_import = os.path.basename(file)
        self.picture.name = self.picture.name_import
        self.picture.type = self._get_picture_type()
        self.picture.directory = self._get_directory(
                directory_id
        )
        with open(self.pathname, 'rb') as f:
            file = ImageFile(f)
            self.picture.sha1 = get_sha1_hexdigest(file)
            self.picture.source_file = file
            self.picture.weight = file.size
            self.picture.width = file.width
            self.picture.height = file.height
            self.picture.save()
        # load metadatas (and save)
        self.picture.load_metadatas()
        # generate previews
        self.picture.generate_previews()
       
        return


    def _get_directory(self, directory_id):
        """Return directory object or None."""
        try:
            directory = Directory.objects.get(
                    pk=directory_id
            )
        except:
            return None
        return directory


    def _get_picture_type(self):
        """Return image type."""
        # we use Pil here to read format of image because wand
        # loads all image in memory to read them and it's slow (0.5s arround with wand
        # against less than 0.2 with Pil for a Canon 5DIII full size picture)
        img = Image.open(self.pathname)
        type = img.format
        del img
        
        return type.lower()




