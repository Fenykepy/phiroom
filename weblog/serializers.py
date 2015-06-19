from rest_framework import serializers

from weblog.models import Post, Tag
from user.serializers import AuthorSerializer


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('url', 'name', 'n_posts', 'slug')
        read_only_fields = ('slug', 'n_posts')


class PostSerializer(serializers.ModelSerializer):
    abstract = serializers.CharField(read_only=True)
    content = serializers.CharField(read_only=True)
    slug = serializers.CharField(read_only=True)
    pk = serializers.IntegerField(read_only=True)
    tags = TagSerializer(many=True, required=False, read_only=True)
    author = AuthorSerializer(read_only=True)
    next = serializers.SerializerMethodField()
    previous = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('url', 'title', 'description', 'source',
                  'tags', 'author', 'draft', 'pub_date',
                  'content', 'abstract', 'slug', 'pk',
                  'next', 'previous',
            )

    def get_next(self, object):
        next = object.get_next_published()
        if (next):
            return next.slug
        return None

    def get_previous(self, object):
        prev = object.get_previous_published()
        if (prev):
            return prev.slug
        return None

class PostAbstractSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = ('url', 'title', 'description',
                'draft', 'pub_date', 'abstract', 'slug',
                'pk', 'author',
        )
