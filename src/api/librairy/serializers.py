from rest_framework import serializers

from librairy.models import Picture, Tag, Label, \
        Collection, CollectionPicture, CollectionsEnsemble, \
        PictureFactory, ZipExport



class RecursiveField(serializers.Serializer):
    """Field wich returns children of self nested models."""
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data




class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'slug')



class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ('name', 'slug', 'color')



class CollectionSerializer(serializers.ModelSerializer):
    
    pictures = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = ('name', 'pk', 'ensemble', 'n_pict', 'pictures')
        read_only_fields = ('pk', 'n_pict')

    def get_pictures(self, object):
        # because many to many relation order is not respected
        # by drf, we get list manually
        return object.get_pictures().values_list('picture', flat=True)



class CollectionPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionPicture
        fields = ('collection', 'picture', 'order')



class CollectionsEnsembleSerializer(serializers.ModelSerializer):
    
    pictures = serializers.SerializerMethodField()
    
    class Meta:
        model = CollectionsEnsemble
        fields = ('name', 'pk', 'collection_set', 'parent', 'pictures')
        read_only_fields = ('pk', 'collection_set')

    def get_pictures(self, object):
        return object.get_pictures().values_list('sha1', flat=True)



class CollectionHeadersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('name', 'pk')



class CollectionsEnsembleHeadersSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)
    collection_set = CollectionHeadersSerializer(many=True)

    class Meta:
        model = CollectionsEnsemble
        fields = ('name', 'pk', 'collection_set', 'children')



class PictureSerializer(serializers.ModelSerializer):
    importation_date = serializers.DateTimeField(read_only=True)
    last_update = serializers.DateTimeField(read_only=True)
    source_file = serializers.CharField(read_only=True)
    name_import = serializers.CharField(read_only=True)
    type = serializers.CharField(read_only=True)
    weight = serializers.IntegerField(read_only=True)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)
    portrait_orientation = serializers.BooleanField(read_only=True)
    landscape_orientation = serializers.BooleanField(read_only=True)
    camera = serializers.CharField(read_only=True)
    lens = serializers.CharField(read_only=True)
    speed = serializers.CharField(read_only=True)
    aperture = serializers.CharField(read_only=True)
    iso = serializers.CharField(read_only=True)
    type = serializers.CharField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    label = LabelSerializer(read_only=True)
    rate = serializers.IntegerField(min_value=0, max_value=5, default=0,
            allow_null=True, required=False)
    exif_date = serializers.DateTimeField(read_only=True)
    exif_origin_date = serializers.DateTimeField(read_only=True)
    previews_path = serializers.ReadOnlyField()
    ratio = serializers.ReadOnlyField()
    sha1 = serializers.ReadOnlyField()
    url = serializers.HyperlinkedIdentityField(
            view_name='picture-detail',
            lookup_field='sha1'
    )

    class Meta:
        model = Picture
        fields = ('url', 'sha1', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'ratio', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url', 'previews_path',
            )


class PictureShortSerializer(serializers.ModelSerializer):
    """A serializer to show public data of pictures."""
    class Meta:
        model = Picture
        fields = ('sha1', 'title', 'legend', 'previews_path', 'ratio')



class PictureSha1Serializer(PictureSerializer):
    """A serializer to show only a picture's sha1."""
    class Meta:
        model = Picture
        fields = ('sha1', )



class PictureUploadSerializer(PictureSerializer):
    """A serializer to upload a picture through HTTP."""
    file = serializers.ImageField(write_only=True)
    name = serializers.CharField(read_only=True)
    copyright_url = serializers.CharField(read_only=True)
    copyright_state = serializers.CharField(read_only=True)
    copyright = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    legend = serializers.CharField(read_only=True)
    rate = serializers.IntegerField(read_only=True)
    color = serializers.BooleanField(read_only=True)

    class Meta:
        model = Picture
        fields = ('url', 'sha1', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'ratio', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url', 'previews_path', 'file'
            )

    def save(self, **kwargs):
        """Create a new Picture instance through PictureFactory."""
        validated_data = dict(
            list(self.validated_data.items()) +
            list(kwargs.items())
        )
        # create Picture with factory
        factory = PictureFactory(**validated_data)
        # serialize created object
        self.instance = factory.picture
        return self.instance



class PictureSha1ListSerializer(serializers.Serializer):
    """A serializer to get a list of sha1'."""
    sha1s = serializers.PrimaryKeyRelatedField(
        queryset=Picture.objects.all(),
        many=True
    )


class ZipExportSerializer(PictureSha1ListSerializer):
    """
    A serializer to get a zip archive with images files:
    take a list of pictures sha1's.
    """
    full = serializers.BooleanField(default=True)

    def save(self):
        zip = ZipExport(pictures = self.validated_data['sha1s'])
        if self.validated_data['full']:
            return zip.get_full()
        return zip.get_large()

    class Meta:
        write_only_fields = ('full', 'sha1s')







