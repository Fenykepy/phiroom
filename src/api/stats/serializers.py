from rest_framework import serializers

from stats.models import Hit


class HitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hit
        fields = ('ip', 'date', 'user', 'type', 'related_key')
        read_only_fields = ('date', 'user')
