from rest_framework import serializers
from .models import Post, Comment, Like
from app.serializers import AuthorSerializer

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = Post
        fields = ('id', 'type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted',)

class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = Comment
        fields = ('id', 'type', 'author', 'comment', 'contentType', 'published',)

class LikeSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = Like
        fields = ('type', 'summary', 'actor', 'object',)