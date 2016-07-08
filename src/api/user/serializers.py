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
                'is_weblog_author',
                'is_librairy_member',
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
                'insta_link',
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
 
    class Meta:
        model = User
        fields = (
                'username',  
                'first_name',
                'last_name',
                'email',
                'is_staff', 
                'is_weblog_author',
                'is_librairy_member',
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
                'insta_link',
                'mail_newsletter',
        )
        read_only_fields =('is_staff', 'is_weblog_author', 'is_librairy_member')


class AuthorSerializer(serializers.ModelSerializer):
    """
    A serializer to show author datas in posts.
    Musn't display any private informations.
    """

    class Meta:
        model = User
        fields = (
            'username', 'author_name', 'avatar',
            'website', 'facebook_link', 'flickr_link',
            'px500_link', 'twitter_link', 'gplus_link',
            'pinterest_link', 'vk_link', 'insta_link',
        )
        read_only_fields = fields



    
