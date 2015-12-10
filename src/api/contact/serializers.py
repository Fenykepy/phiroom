from rest_framework import serializers

from contact.models import Description, Message


class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = ('title', 'source', 'content', 'author')
        read_only_fields = ('author', 'content')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('name', 'user', 'mail', 'website',
                  'subject', 'message', 'forward',
                  'date', 'ip'
        )
        read_only_fields = ('user', 'date', 'ip')


class AuthenticatedMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('name', 'user', 'mail', 'website',
                  'subject', 'message', 'forward',
                  'date', 'ip'
        )
        read_only_fields = ('user', 'date', 'ip',
                'name', 'mail', 'website')
    
