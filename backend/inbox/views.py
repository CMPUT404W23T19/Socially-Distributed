from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Inbox
from .serializers import InboxSerializer
from rest_framework import status
from app.models import Author, Follow
from posts.models import Post

# Create your views here.

### NEED TO ADD ERROR HANDLING FOR WHEN AUTHOR DOES NOT EXIST. FOR ALL VIEWS ###

class InboxView(ModelViewSet):
    """
    List all :model: `inbox.Inbox`,
    or create a new :model: `inbox.Inbox`.

    Authentication required.

    """
    queryset=Inbox.objects.all()
    serializer_class=InboxSerializer
    # permission_classes=[IsAuthenticated] #ignore for now

    def get_queryset(self):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        inbox=Inbox.objects.get(author=author_id)
        return inbox

    def list(self, request, *args, **kwargs):
        author_id='http://127.0.0.1:8000/authors/'+self.kwargs['author_id']
        queryset = self.get_queryset()
        serializer = InboxSerializer(queryset, many=True)
        # get posts and requests and put them in one list
        items = []
        for item in serializer.data:
            posts = item['posts']
            requests = item['requests']
            items.append(posts)
            items.append(requests)
        response = {"type": "inbox", "author":author_id, "items": items}
        return Response(response, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        inbox = self.get_queryset()
        type = request.data['type']
        if type == 'post':
            # todo: check if author exists, if post exists. Else create.
            post = Post.objects.create(id=request.data['id'], title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], author=request.data['author'], categories=request.data['categories'], count=request.data['count'], size=request.data['size'], comments=request.data['comments'], published=request.data['published'], visibility=request.data['visibility'], unlisted=request.data['unlisted'])
            inbox.posts.add()
            return Response(status=status.HTTP_201_CREATED)
        elif type == 'request':
            # todo: check if author exists, if follow exists. Else create.
            follow = Follow.objects.create(author=request.data['author'], object=request.data['object'], summary=request.data['summary'])
            inbox.requests.add()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, *args, **kwargs):
        inbox = self.get_queryset()
        inbox.posts.clear()
        inbox.requests.clear()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    



