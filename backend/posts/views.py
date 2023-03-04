from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.logging.logging_service import Logger
from common.email.email_service import send_email
from app.models import Author
from .models import Post
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import PostSerializer
from app.serializers import AuthorSerializer
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from datetime import datetime

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
        instance = Author.objects.get(id=author_id)
        post = Post.objects.create(author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=datetime.now().isoformat(), visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        post.id = 'http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+ '/posts/'+str(post.id)
        post.save()
        return Response(status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        """
        This view should return a list of all the posts
        for the currently authenticated user.
        """
        queryset = self.get_queryset()
        serializer = PostSerializer(queryset, many=True)
        response = {"type": "posts", "items": serializer.data}
        return Response(response)

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
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs): # change according to the spec? maybe...
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        post_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=datetime.now().isoformat(), visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        return Response(status=status.HTTP_201_CREATED)
