from rest_framework.generics import (ListCreateAPIView,RetrieveUpdateDestroyAPIView,ListAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.logging.logging_service import Logger
from common.email.email_service import send_email
from .models import Author
# from .permission import IsOwnerProfileOrReadOnly
from .serializers import AuthorSerializer
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
