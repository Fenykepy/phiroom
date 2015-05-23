from rest_framework import serializers

from librairy.models import Picture, Tag, Label, Directory, \
        Collection, CollectionsEnsemble, PictureFactory



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



class DirectorySerializer(serializers.ModelSerializer):
    """Directory objects serializer."""
    slug = serializers.CharField(read_only=True)
    children = serializers.HyperlinkedRelatedField(
            many=True,
            read_only=True,
            view_name='directory-detail'
    )
    class Meta:
        model = Directory
        fields = ('url', 'pk', 'name', 'slug', 'parent', 'children')



class DirectorysListSerializer(DirectorySerializer):
    """Serializer for tree of directory objects."""
    children = RecursiveField(many=True, read_only=True)





class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('name', 'slug')



class CollectionsEnsembleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionsEnsemble
        fields = ('name', 'slug')
    


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

    class Meta:
        model = Picture
        fields = ('url', 'pk', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type', 'directory',
                'weight','width', 'height', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url',
            )



class PictureUploadSerializer(PictureSerializer):
    """A serializer to upload a picture through HTTP."""
    file = serializers.ImageField(write_only=True)
    directory = serializers.PrimaryKeyRelatedField(
            queryset = Directory.objects.all(),
            required=False,
            allow_null=True,
            default=None,
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
        fields = ('url', 'pk', 'importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type', 'directory',
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
        print(factory.picture)
        self.instance = factory.picture
        return self.instance




