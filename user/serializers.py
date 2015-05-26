from rest_framework import serializers

from user.models import User

class UserSerializer(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = (
                'pk',
                'url', 
                'username', 
                'first_name',
                'last_name',
                'email',
                'is_staff', 
                'is_active',
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
                'is_authenticated',
                'mail_newsletter',
                'mail_contact',
                'mail_registration',
        )

    def get_is_authenticated(self, object):
        return object.is_authenticated()



class SafeUserSerializer(UserSerializer):
    """
    A serialiser which writting safe data of an user
    (is_staff read_only, less fields accessible).
    """
    is_staff = serializers.ReadOnlyField()
    username = serializers.ReadOnlyField()
 
    class Meta:
        model = User
        fields = (
                'username',  
                'first_name',
                'last_name',
                'email',
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
                'is_authenticated',
                'mail_newsletter',
        )
    
