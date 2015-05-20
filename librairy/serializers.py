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
    

class PictureUploadSerializer(serializers.Serializer):
    """A serializer to upload a picture through HTTP."""
    file = serializers.ImageField(write_only=True)
    directory_id = serializers.IntegerField(required=False)

    def create(self, validated_data):
        """Create a new Picture instance through PictureFactory."""
        # create Picture with factory
        factory = PictureFactory(**validated_data)
        # serialize created object
        serializer = PictureSerializer(factory.picture)
        return serializer.data




class PictureSerializer(serializers.HyperlinkedModelSerializer):
    importation_date = serializers.DateTimeField(read_only=True)
    last_update = serializers.DateTimeField(read_only=True)
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
    label = LabelSerializer()
    rate = serializers.IntegerField(read_only=True, min_value=0,
            max_value=5)
    exif_date = serializers.DateTimeField(read_only=True)
    exif_origin_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Picture
        fields = ('importation_date', 'last_update', 'source_file',
                'title', 'legend', 'name_import', 'name', 'type',
                'weight','width', 'height', 'portrait_orientation',
                'landscape_orientation', 'color', 'camera', 'lens',
                'speed', 'aperture', 'iso', 'tags', 'label', 'rate',
                'exif_date', 'exif_origin_date', 'copyright',
                'copyright_state', 'copyright_url'
            )


