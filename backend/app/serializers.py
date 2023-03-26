from rest_framework import serializers
from .models import Author, Follow

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'type', 'displayName', 'host', 'github', 'profileImage', 'url')

class RequestSerializer(serializers.ModelSerializer):
    object = AuthorSerializer(read_only=True)
    actor = AuthorSerializer(read_only=True)
    class Meta:
        model = Follow
        fields = ('type', 'summary', 'actor', 'object')

        