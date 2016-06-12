from rest_framework import serializers

from stats.models import  PortfolioHit, PostHit, PictureHit, ContactHit


class PortfolioHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioHit
        fields = ('ip', 'date', 'user', 'portfolio')



class PostHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostHit
        fields = ('ip', 'date', 'user', 'portfolio')   



class PictureHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PictureHit
        fields = ('ip', 'date', 'user', 'portfolio')



class ContactHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PictureHit
        fields = ('ip', 'date', 'user', 'portfolio')
