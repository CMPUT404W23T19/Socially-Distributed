from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Inbox
from .serializers import InboxSerializer
from rest_framework import status
from app.models import Author, Follow
from posts.models import Post

# Create your views here.

### NEED TO ADD ERROR HANDLING FOR WHEN AUTHOR DOES NOT EXIST. FOR ALL VIEWS ###

class InboxView(APIView):
    """
    List all :model: `inbox.Inbox`,
    or create a new :model: `inbox.Inbox`.

    Authentication required.

    """

    # permission_classes=[IsAuthenticated] #ignore for now

    def get_queryset(self):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        inbox=Inbox.objects.get(author=author_id)
        return inbox

    def get(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        queryset = self.get_queryset()
        serializer = InboxSerializer(queryset)
        # get posts and requests and put them in one list
        items = []
        posts = serializer.data['posts']
        requests = serializer.data['requests']
        for post in posts:
            items.append(post)
        for request in requests:
            items.append(request)
        response = {"type": "inbox", "author":author_id, "items": items}
        return Response(response, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        inbox = self.get_queryset()
        type = request.data['type']

        if type == 'post':
            # todo: check if author exists, if post exists. Else create.
            try:
                post = Post.objects.get(id=request.data['id'])
            except Post.DoesNotExist:
                try:
                    author = Author.objects.get(id=request.data['author']['id'])
                except Author.DoesNotExist:
                    author = Author.objects.create(id=request.data['author']['id'], host=request.data['author']['host'], displayName=request.data['author']['displayName'], url=request.data['author']['url'], github=request.data['author']['github'], profileImage=request.data['author']['profileImage'])
                post = Post.objects.create(id=request.data['id'], title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], author=author, categories=request.data['categories'], count=request.data['count'], comments=request.data['comments'], published=request.data['published'], visibility=request.data['visibility'], unlisted=request.data['unlisted'])
            inbox.posts.add(post)
            return Response(status=status.HTTP_201_CREATED)
        
        elif type == 'follow':
            # todo: check if author exists, if follow exists. Else create.
            try:
                author = Author.objects.get(id=request.data['author']['id'])
            except Author.DoesNotExist:
                author = Author.objects.create(id=request.data['author']['id'], host=request.data['author']['host'], displayName=request.data['author']['displayName'], url=request.data['author']['url'], github=request.data['author']['github'], profileImage=request.data['author']['profileImage'])
            try:
                object = Author.objects.get(id=request.data['object']['id'])
            except Author.DoesNotExist: # local author does not exist
                return Response(status=status.HTTP_404_NOT_FOUND)
            follow = Follow.objects.create(author=author, object=object, summary=request.data['summary'])
            inbox.requests.add(follow)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, *args, **kwargs):
        inbox = self.get_queryset()
        inbox.posts.clear()
        inbox.requests.clear()
        return Response(status=status.HTTP_204_NO_CONTENT)


