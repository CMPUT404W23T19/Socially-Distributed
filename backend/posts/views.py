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
from rest_framework.viewsets import ModelViewSet
from datetime import datetime
import uuid

# Create your views here.

class PostList(ListCreateAPIView):
    """
    List all :model: `posts.Post`,
    or create a new :model: `posts.Post`.

    Authentication required.

    """
    queryset=Post.objects.all()
    serializer_class=PostSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def create(self, request, *args, **kwargs):
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

class PostDetailView(ModelViewSet):
    """
    Display an individual :model: `posts.Post`,
    or update an existing :model: `posts.Post`,
    or partial_update an existing :model: `posts.Post`.
    or delete an existing :model: `posts.Post`.

    Authentication required to update or delete.
    Non-authenticated users can only view(get).

    """

    queryset=Post.objects.all()
    serializer_class=PostSerializer
    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = self.get_serializer(instance)
        # log request data
        logger = logging.getLogger("app")
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=datetime.now().isoformat(), visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        return Response(status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs): #
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
