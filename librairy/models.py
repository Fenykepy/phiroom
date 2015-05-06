import os

from django.db import models
from django.core.files.storage import FileSystemStorage

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
            'previews',
            'full',
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
    absolute_url = models.URLField()
    sha1 = models.CharField(max_length=42, unique=True, db_index=True)
    source_file = models.ImageField(upload_to=set_picturename,
            storage=PictureFileSystemStorage()
    )
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
    tags = models.ManyToManyField('Tag', null=True, blank=True,
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






class Tag(models.Model):
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




    

    
    
