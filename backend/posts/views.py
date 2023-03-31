from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging
from common.email.email_service import send_email
from app.models import Author
from .models import Post, Comment, Like
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from app.serializers import AuthorSerializer
from rest_framework import status
from rest_framework.views import APIView
from datetime import datetime
import uuid, base64
from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.

HOST = 'https://floating-fjord-51978.herokuapp.com/authors/'

class PostList(ListCreateAPIView):
    """
    GET: List all posts for the currently authenticated user.
    POST: Create a new post for the currently authenticated user.
    """
    
    serializer_class=PostSerializer
    permission_classes=[IsAuthenticated] 

    def get_queryset(self):
        author_id=HOST+self.kwargs['author_id']
        posts=Post.objects.filter(author=author_id)
        return posts

    def create(self, request, *args, **kwargs):
        """
        Create a new post for the currently authenticated user.
        """
        self.authentication_classes = [JWTAuthentication]
        author_id=HOST+self.kwargs['author_id']
        post_id = author_id + "/posts/" + str(uuid.uuid4())
        instance = Author.objects.get(id=author_id)
        published = datetime.now().isoformat()
        post = Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=published, visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        """
        This view should return a list of all the posts
        for the currently authenticated user.
        """
        self.authentication_classes = [BasicAuthentication]
        if 'page' in request.GET:
            p = PageNumberPagination()
            p.page_query_param = 'page'
            p.page_size_query_param = 'size'
            queryset = self.get_queryset()
            posts = p.paginate_queryset(queryset, request)
            page = int(p.get_page_number(request, p))
            size = p.get_page_size(request)
            serializer = PostSerializer(posts, many=True)
            response = {"type": "posts", 'page': page, 'size': size, "items": serializer.data}
        else:
            queryset = self.get_queryset()
            serializer = PostSerializer(queryset, many=True)
            response = {"type": "posts", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class PostDetailView(APIView):
    """
    GET: Get a single post of the currently authenticated user.
    POST: Update a single post of the currently authenticated user.
    PUT: Create a single post of the currently authenticated user with given post id.
    DELETE: Delete a single post of the currently authenticated user.
    """

    permission_classes=[IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        This view should return a single post of the currently authenticated user.
        """
        self.authentication_classes = [BasicAuthentication]
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = PostSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):  # post is used for update
        """
        Update a single post of the currently authenticated user.
        """
        self.authentication_classes = [JWTAuthentication]
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        serializer = PostSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """
        Delete a single post of the currently authenticated user.
        """
        self.authentication_classes = [JWTAuthentication]
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        """
        Create a single post of the currently authenticated user with given post id.
        """
        self.authentication_classes = [JWTAuthentication]
        author_id=HOST+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        Post.objects.create(id=post_id, author=instance, title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], categories=request.data['categories'], count=0, published=datetime.now().isoformat(), visibility=request.data['visibility'], unlisted=request.data['unlisted'])
        return Response(status=status.HTTP_201_CREATED)
    
    
class GetImageView(APIView):

    permission_classes=[IsAuthenticated]
    authentication_classes = [BasicAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Returns a decoded image of specified Image post.
        """
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        instance = Post.objects.get(id=post_id)

        if instance.contentType == "image/png;base64" or instance.contentType == "image/jpeg;base64" or instance.contentType == "application/base64":
            return Response(base64.b64decode(instance.content), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PostLikes(APIView):
    
    permission_classes=[IsAuthenticated]
    authentication_classes = [BasicAuthentication]

    def get(self, request, *args, **kwargs):
        """
        get a list of authors who liked the post
        """
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        likes = Like.objects.filter(object=post_id)
        serializer = LikeSerializer(likes, many=True)
        response = {"type": "likes", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)
    
class CommentLikes(APIView):

    permission_classes=[IsAuthenticated]
    authentication_classes = [BasicAuthentication]

    def get(self, request, *args, **kwargs):
        """
        get a list of authors who liked the comment
        """
        comment_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']+ '/comments/' + self.kwargs['comment_id']
        likes = Like.objects.filter(object=comment_id)
        serializer = LikeSerializer(likes, many=True)
        response = {"type": "likes", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)
    
class AuthorLiked(APIView):

    permission_classes=[IsAuthenticated]
    authentication_classes = [BasicAuthentication]

    def get(self, request, *args, **kwargs):
        """
        get a list of posts and comments liked by the author
        """
        author_id=HOST+self.kwargs['author_id']
        likes = Like.objects.filter(author=author_id)
        serializer = LikeSerializer(likes, many=True)
        response = {"type": "liked", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class CommentsView(ListCreateAPIView):
    """
    GET: Get all comments of a post of the currently authenticated user.
    POST: Create a comment on a post of the currently authenticated user.
    """

    permission_classes=[IsAuthenticated]

    paginate_by = 5

    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        return Comment.objects.filter(post=post_id)
    
    def create(self, request, *args, **kwargs):
        self.authentication_classes = [JWTAuthentication]
        post_id = HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        comment_id = post_id + '/comments/' + str(uuid.uuid4())
        try:
            author = Author.objects.get(id=request.data['author']['id'])
            post = Post.objects.get(id=post_id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(id=comment_id, post=post, author=author, comment=request.data['comment'], contentType=request.data['contentType'], published=datetime.now().isoformat())
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        self.authentication_classes = [BasicAuthentication]
        post_id=HOST+self.kwargs['author_id']+'/posts/'+self.kwargs['post_id']
        if 'page' in request.GET:
            p = PageNumberPagination()
            p.page_query_param = 'page'
            p.page_size_query_param = 'size'
            queryset = self.get_queryset()
            if not queryset: # if queryset is empty
                return Response({"type": "comments", "items": [],})
            comments = p.paginate_queryset(queryset, request)
            page = p.get_page_number(request, p)
            size = p.get_page_size(request)
            serializer = self.get_serializer(comments, many=True)
            response = {"type": "comments", "items": serializer.data, "page": page, "size": size, "post": post_id}
        else:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            response = {"type": "comments", "items": serializer.data, "post": post_id}
        return Response(response)
        



    
