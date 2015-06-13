from rest_framework import serializers

from weblog.models import Post, Tag


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'n_posts', 'slug')


class PostSerializer(serializers.ModelSerializer):
    abstract = serializers.CharField(read_only=True)
    content = serializers.CharField(read_only=True)
    slug = serializers.CharField(read_only=True)
    pk = serializers.IntegerField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author = serializers.ReadOnlyField(source='author.author_name')
    class Meta:
        model = Post
        fields = ('url', 'title', 'description', 'source',
                  'tags', 'author', 'draft', 'pub_date',
                  'content', 'abstract', 'slug', 'pk',
            )

