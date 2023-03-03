from rest_framework import serializers
from .models import Author
from posts.models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'author', 'published_date')

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'type', 'display_name', 'host', 'github', 'profile_image', 'url', 'posts')

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('followers',)

        