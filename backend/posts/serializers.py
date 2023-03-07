from rest_framework import serializers
from .models import Post
from app.serializers import AuthorSerializer

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ('id', 'type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted',)