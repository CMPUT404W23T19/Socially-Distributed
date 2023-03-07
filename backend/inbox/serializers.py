from rest_framework import serializers
from .models import Inbox
from posts.serializers import PostSerializer
from app.serializers import RequestSerializer

class InboxSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)
    requests = RequestSerializer(many=True, read_only=True)
    class Meta:
        model = Inbox
        fields = ('type', 'author', 'posts', 'requests')