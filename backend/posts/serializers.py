from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'published', 'visibility', 'unlisted')