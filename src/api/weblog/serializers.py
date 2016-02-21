from rest_framework import serializers

from librairy.models import Picture
from weblog.models import Post, PostPicture, Tag


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ('url', 'name', 'n_posts', 'slug')
        read_only_fields = ('slug', 'n_posts')



class PostSerializer(serializers.ModelSerializer):
    # pub_date musn't be null=Trueiin model
    # else get_next_by_pub_date()
    # won't work, so use required=False allow_null=True here
    pub_date = serializers.DateTimeField(required=False, allow_null=True)
    tags_flat_list = serializers.ListField(
            required=False,
            write_only=True,
            child = serializers.CharField(max_length=50)
    )
    next = serializers.SerializerMethodField()
    previous = serializers.SerializerMethodField()
    pictures = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, required=False, read_only=True)
    url = serializers.HyperlinkedIdentityField(
            view_name='post-detail',
            lookup_field='slug'
    )

    class Meta:
        model = Post
        fields = ('url', 'title', 'description', 'source',
                  'tags', 'author', 'draft', 'pub_date',
                  'content', 'abstract', 'slug',
                  'next', 'previous', 'tags_flat_list',
                  'pictures',
        )
        read_only_fields = ('slug', 'author', 'content',
                'abstract', 'tags')


    def add_tags(self, tags_flat_list, instance):
        for tag_name in tags_flat_list:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)


    def create(self, validated_data):
        # store tags flat list
        tags_flat_list = validated_data.get('tags_flat_list', [])
        # delete tags flat list for it to not to be send to create()
        del validated_data['tags_flat_list']
        post = Post.objects.create(**validated_data)
        self.add_tags(tags_flat_list, post)

        return post


    def update(self, instance, validated_data):
        # actual instance tags
        tags = instance.tags.all()
        # store tags flat list
        tags_flat_list = validated_data.get('tags_flat_list', [])
        for tag in tags:
            # remove not used tags
            if not tag.name in tags_flat_list:
                instance.tags.remove(tag)
            # remove name from flat tags list to do not
            # attempt to add it later (and save one query)
            else:
                tags_flat_list.remove(tag.name)

        self.add_tags(tags_flat_list, instance)
        
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.source = validated_data.get('source', instance.source)
        instance.draft = validated_data.get('draft', instance.draft)
        instance.pub_date = validated_data.get('pub_date', instance.pub_date)
        instance.source = validated_data.get('source', instance.source)
        instance.save()
        # reload instance here, not efficient but else 
        # new added tags are not rendered in json
        instance = Post.objects.get(pk=instance.pk)

        return instance


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

    def get_pictures(self, object):
        return object.get_pictures().values_list('picture', flat=True)



class PostAbstractSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = ('url', 'title', 'description',
                'draft', 'pub_date', 'abstract', 'slug',
                'author', 'pictures'
        )


class PostPictureSerializer(serializers.ModelSerializer):
    post = serializers.SlugRelatedField(
            slug_field="slug",
            queryset=Post.objects.all()
    )
    class Meta:
        model = PostPicture
        field = ('post', 'picture', 'order')


class PostHeadSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = ('title', 'slug')

