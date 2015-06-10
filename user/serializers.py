from rest_framework import serializers

from user.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
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
                'mail_newsletter',
                'mail_contact',
                'mail_registration',
                'password',
        )

        def create(self, validated_data):
            return User.objects.create(**validated_data)

        def update(self, instance, validated_data):
            password = validated_data.get('password', None)

            if password:
                instance.set_password(password)
                instance.save()

            return instance



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
                'mail_newsletter',
                'password',
        )


    
