from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging
from common.email.email_service import send_email
from app.models import Author
from .models import Post
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import PostSerializer
from app.serializers import AuthorSerializer
from rest_framework import status
from rest_framework.views import APIView
from datetime import datetime
import uuid

# Create your views here.

class PostList(ListCreateAPIView):
   
    queryset=Post.objects.all()
    serializer_class=PostSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def create(self, request, *args, **kwargs):
        """
        Create a new post for the currently authenticated user.
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        post_id = author_id + "/posts/" + str(uuid.uuid4())
        instance = Author.objects.get(id=author_id)
        published = datetime.now().isoformat()
        post = Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=published, visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        return Response(status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        """
        This view should return a list of all the posts
        for the currently authenticated user.
        """
        queryset = self.get_queryset()
        serializer = PostSerializer(queryset, many=True)
        response = {"type": "posts", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class PostDetailView(APIView):
    """
    Display an individual :model: `posts.Post`,
    or update an existing :model: `posts.Post`,
    or partial_update an existing :model: `posts.Post`.
    or delete an existing :model: `posts.Post`.

    Authentication required to update or delete.
    Non-authenticated users can only view(get).

    """

    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        This view should return a single post of the currently authenticated user.
        """
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = PostSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):  # post is used for update
        """
        Update a single post of the currently authenticated user.
        """
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = PostSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """
        Ddelete a single post of the currently authenticated user."""
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        """
        Create a single post of the currently authenticated user with given post id.
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=datetime.now().isoformat(), visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        return Response(status=status.HTTP_201_CREATED)
    
