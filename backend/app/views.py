from rest_framework.generics import (ListCreateAPIView,RetrieveUpdateDestroyAPIView,ListAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.logging.logging_service import Logger
from common.email.email_service import send_email
from .models import Author
from posts.models import Post
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import AuthorSerializer
from rest_framework import status
from rest_framework.views import APIView

# Create your views here.

class AuthorListCreateView(ListCreateAPIView):
    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def perform_create(self, serializer): # overwrite
        user=self.request.user
        serializer.save(user=user)

    def list(self, request, *args, **kwargs):
        """
        
        Return a list of all the authors
        """
        queryset = self.get_queryset()
        serializer = AuthorSerializer(queryset, many=True)
        response = {"type": "authors", "items": serializer.data}
        return Response(response)


class AuthorDetailView(APIView):

    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Return an individual author
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        serializer = AuthorSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        """
        Update an individual author details
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        instance = Author.objects.get(id=author_id)
        serializer = AuthorSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class FollowerList(ListAPIView):

    serializer_class=AuthorSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def get_queryset(self):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author=Author.objects.get(id=author_id)
        return author.followers.all()
    
    def list(self, request, *args, **kwargs):
        """
        Get all followers of an author
        """
        queryset = self.get_queryset()
        serializer = AuthorSerializer(queryset, many=True)
        response = {"type": "followers", "items": serializer.data}
        return Response(response, status=status.HTTP_200_OK)
    
    
class FollowerDetailView(RetrieveUpdateDestroyAPIView):

    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    # permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        """
        check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author = Author.objects.get(id=author_id)
        friend_id = 'http://127.0.0.1:8000/authors/'+self.kwargs['friend_id']
        exists = author.followers.filter(id=friend_id).exists()
        if exists:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def update(self, request, *args, **kwargs):
        """
        Add a follower to current author
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        friend_id='http://127.0.0.1:8000/authors/'+self.kwargs['friend_id']
        try:
            author = Author.objects.get(id=author_id)
            friend = Author.objects.get(id=friend_id)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        author.followers.add(friend)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """
        Remove a follower from current author
        """
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        author = Author.objects.get(id=author_id)
        exists = author.followers.filter(id=self.kwargs['friend_id']).exists()
        if exists:
            friend = Author.objects.get(id=self.kwargs['friend_id'])
            author.followers.remove(friend)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        


