from django.contrib.auth.models import User

from rest_framework import serializers

from weblog.models import Post, Tag


class PostSerializer(serializers.HyperlinkedModelSerializer):
    abstract = serializers.CharField(read_only=True)
    content = serializers.CharField(read_only=True)
    slug = serializers.CharField(read_only=True)
    class Meta:
        model = Post
        fields = ('url', 'title', 'description', 'source',
                  'tags', 'author', 'draft', 'pub_date',
                  'content', 'abstract', 'slug',
            )

        
class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('url', 'name', 'n_posts')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')
