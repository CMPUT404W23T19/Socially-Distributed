from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'type', 'display_name', 'host', 'github', 'profile_image', 'url')

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('followers',)

        