from rest_framework import serializers

from librairy.models import Picture, Tag, Label, \
        Collection, CollectionsEnsemble, PictureFactory, \
        ZipExport



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
    class Meta:
        model = Collection
        fields = ('name', 'slug', 'ensemble', 'n_pict')
        read_only_fields = ('slug', 'n_pict')



class CollectionsEnsembleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionsEnsemble
        fields = ('name', 'slug', 'collection_set', 'parent')


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

    class Meta:
        model = Picture
        fields = ('url', 'pk', 'sha1', 'importation_date', 'last_update', 'source_file',
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
        fields = ('pk', 'sha1', 'title', 'legend', 'previews_path', 'ratio')



class PicturePkSerializer(PictureSerializer):
    """A serializer to show only a picture's pk."""
    class Meta:
        model = Picture
        fields = ('pk', )



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
        fields = ('url', 'pk', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url', 'file'
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



class PicturePkListSerializer(serializers.Serializer):
    """A serializer to get a list of pk."""
    pks = serializers.PrimaryKeyRelatedField(
        queryset=Picture.objects.all(),
        many=True
    )


class ZipExportSerializer(PicturePkListSerializer):
    """
    A serializer to get a zip archive with images files:
    take a list of pictures pks.
    """
    full = serializers.BooleanField(default=True)

    def save(self):
        zip = ZipExport(pictures = self.validated_data['pks'])
        if self.validated_data['full']:
            return zip.get_full()
        return zip.get_large()

    class Meta:
        write_only_fields = ('full', 'pks')







