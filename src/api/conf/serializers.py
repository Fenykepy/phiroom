from rest_framework import serializers

from conf.models import Conf, Page


class ConfSerializer(serializers.ModelSerializer):
    
    # set files as charfield else we get
    # api link (127.0.0.1:8000 in dev) instead
    # of relative link
    weblog_logo = serializers.CharField()
    librairy_logo = serializers.CharField()
    
    class Meta:
        model = Conf
        fields = (
              'title',
              'subtitle',
              'weblog_logo',
              'librairy_logo', 
              'n_posts_per_page',
              'abstract_delimiter',
              'abstract_last_char',
              'abstract_replaced_chars',
              'carousel_default_height',
              'slideshow_duration',
              'etsy_link',
              'fb_link',
              'twitter_link',
              'gplus_link',
              'flickr_link',
              'vk_link',
              'pinterest_link',
              'px500_link',
              'insta_link',
              'registration_mail',
              'comment',
        )

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
