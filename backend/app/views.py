from rest_framework.generics import (ListCreateAPIView,RetrieveUpdateDestroyAPIView,ListAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.logging.logging_service import Logger
from common.email.email_service import send_email
from .models import Author
from posts.models import Post
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import AuthorSerializer, FollowerSerializer
from rest_framework import status
from rest_framework.views import APIView

# Create your views here.

class AuthorListCreateView(ListCreateAPIView):
    """
    List all :model: `app.Author`,
    or create a new :model: `app.Author`.

    Authentication required.

    """
    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def perform_create(self, serializer): # overwrite
        user=self.request.user
        serializer.save(user=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = AuthorSerializer(queryset, many=True)
        response = {"type": "authors", "items": serializer.data}
        return Response(response)


class AuthorDetailView(RetrieveUpdateDestroyAPIView):
    """
    Display an individual :model: `app.userProfile`, 
    or update an existing :model: `app.userProfile`,
    or partial_update an existing :model: `app.userProfile`.
    or delete an existing :model: `app.userProfile`.

    Authentication required to update or delete.
    Non-authenticated users can only view(get).

    """

    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class FollowerList(ListAPIView):
    """
    List all :model: `app.Author`'s followers,
    or create a new :model: `app.Author`'s followers.

    Authentication required.

    """
    serializer_class=FollowerSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def get_queryset(self):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author=Author.objects.get(id=author_id)
        return author.followers.all()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = FollowerSerializer(queryset, many=True)
        response = {"type": "followers", "items": serializer.data}
        return Response(response)
    
class FollowerDetailView(RetrieveUpdateDestroyAPIView):
    """
    Display an individual :model: `app.userProfile`, 
    or update an existing :model: `app.userProfile`,
    or partial_update an existing :model: `app.userProfile`.
    or delete an existing :model: `app.userProfile`.

    Authentication required to update or delete.
    Non-authenticated users can only view(get).

    """

    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author = Author.objects.get(id=author_id)
        exists = author.followers.filter(id=self.kwargs['friend_id']).exists()
        if exists:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def update(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author = Author.objects.get(id=author_id)
        friend = Author.objects.get(id=self.kwargs['friend_id'])
        author.followers.add(friend)

    def destroy(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author = Author.objects.get(id=author_id)
        exists = author.followers.filter(id=self.kwargs['friend_id']).exists()
        if exists:
            friend = Author.objects.get(id=self.kwargs['friend_id'])
            author.followers.remove(friend)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        


