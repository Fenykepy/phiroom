from rest_framework import serializers

from conf.models import Conf, Page


class ConfSerializer(serializers.ModelSerializer):
    home_page_state = serializers.SerializerMethodField()

    class Meta:
        model = Conf
        fields = ('domain', 'title', 'subtitle', 'logo', 'n_posts_per_page',
                'home_page', 'fb_link', 'twitter_link', 'gplus_link',
                'flickr_link', 'vk_link', 'registration_mail', 'comment',
                'home_page_state',
        )

    def get_home_page_state(self, obj):
        """Returns home page state from home_page instance."""
        return obj.get_home_page_state()


    def update(self, instance, validated_data):
        """create new instance at each update."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # create new object in db
        instance.pk = None
        instance.save()

        return instance




class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('name', 'title', 'is_in_main_menu', 'position_in_main_menu',
                'is_active', 'content', 'source', 'state',
        )
