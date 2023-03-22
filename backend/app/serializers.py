from rest_framework import serializers
from .models import Author, Follow

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'type', 'display_name', 'host', 'github', 'profile_image', 'url')

class RequestSerializer(serializers.ModelSerializer):
    object = AuthorSerializer(read_only=True)
    actor = AuthorSerializer(read_only=True)
    class Meta:
        model = Follow
        fields = ('type', 'summary', 'actor', 'object')

        