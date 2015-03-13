from rest_framework import serializers

from user.models import User

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
                'url', 
                'username', 
                'is_staff', 
                'avatar',
                'author_name',
                'website',
                'facebook_link',
                'flickr_link',
                'px500_link',
                'twitter_link',
                'gplus_link',
                'pinterest_link',
                'vk_link',
        )
