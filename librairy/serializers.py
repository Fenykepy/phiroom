from rest_framework import serializers

from librairy.models import Picture, Tag, Label, Directory, \
        Collection, CollectionsEnsemble, PictureFactory


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'slug')



class LabelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Label
        fields = ('name', 'slug', 'color')


class DirectorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Directory
        fields = ('name', 'slug')



class CollectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Collection
        fields = ('name', 'slug')



class CollectionsEnsembleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CollectionsEnsemble
        fields = ('name', 'slug')
    


class PictureSerializer(serializers.HyperlinkedModelSerializer):
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
    rate = serializers.IntegerField(min_value=0, max_value=5)
    exif_date = serializers.DateTimeField(read_only=True)
    exif_origin_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Picture
        fields = ('pk', 'url', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url',
            )



class PictureUploadSerializer(PictureSerializer):
    """A serializer to upload a picture through HTTP."""
    file = serializers.ImageField(write_only=True)
    directory_id = serializers.IntegerField(
            write_only=True,
            required=False,
            allow_null=True,
            default=None
    )
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
        fields = ('pk', 'url', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url', 'file', 'directory_id'
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
        print(factory.picture)
        self.instance = factory.picture
        return self.instance




