from rest_framework import serializers

class CSRFTokenSerializer(serializers.Serializer):
    token = serializers.CharField()

