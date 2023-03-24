from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Inbox
from .serializers import InboxSerializer
from rest_framework import status
from app.models import Author, Follow
from posts.models import Post, Comment, Like
from common.logging.logging_service import Logger
import json
from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import BasicAuthentication
from rest_framework.simplejwt.authentication import JWTAuthentication

# Create your views here.

### NEED TO ADD ERROR HANDLING FOR WHEN AUTHOR DOES NOT EXIST. FOR ALL VIEWS ###

HOST = 'https://floating-fjord-51978.herokuapp.com/authors/'

class InboxView(APIView):

    # permission_classes=[IsAuthenticated] #ignore for now

    def get_queryset(self):
        author_id=HOST+self.kwargs['author_id']
        inbox=Inbox.objects.get(author=author_id)
        return inbox

    def get(self, request, *args, **kwargs):
        """
        Get inbox for a given author
        """
        self.authentication_classes = [JWTAuthentication]
        author_id=HOST+self.kwargs['author_id']
        if 'page' in request.GET:
            p = PageNumberPagination()
            p.page_query_param = 'page'
            p.page_size_query_param = 'size'
            queryset = self.get_queryset()
            serializer = InboxSerializer(queryset)
            page = p.get_page_number(request, p)
            size = p.get_page_size(request)
        else:
            queryset = self.get_queryset()
            serializer = InboxSerializer(queryset)
            page = None
            size = None
        # get posts and requests and put them in one list
        items = []
        try:
            posts = serializer.data['posts']
        except KeyError:
            posts = []
        try:
            requests = serializer.data['requests']
        except KeyError:
            requests = []
        try:
            comments = serializer.data['comments']
        except KeyError:
            comments = []
        try:
            likes = serializer.data['likes']
        except KeyError:
            likes = []

        for post in posts:
            items.append(post)
        for request in requests:
            items.append(request)
        for comment in comments:
            items.append(comment)
        for like in likes:
            items.append(like)
        response = {"type": "inbox", "author":author_id, "items": items, "size": size, "page": page}
        return Response(response, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        """
        Add a post or request to the inbox
        """
        inbox = self.get_queryset()
        type = request.data['type']

        if type == 'post':
            try:
                post = Post.objects.get(id=request.data['id'])
            except Post.DoesNotExist:
                try:
                    author = Author.objects.get(id=request.data['author']['id'])
                except Author.DoesNotExist:
                    try:
                        author = Author.objects.create(id=request.data['author']['id'], host=request.data['author']['host'], displayName=request.data['author']['displayName'], url=request.data['author']['url'], github=request.data['author']['github'], profileImage=request.data['author']['profileImage'])
                    except:
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                try:
                    post = Post.objects.create(id=request.data['id'], title=request.data['title'], source=request.data['source'], origin=request.data['origin'], description=request.data['description'], contentType=request.data['contentType'], content=request.data['content'], author=author, categories=request.data['categories'], count=request.data['count'], comments=request.data['comments'], published=request.data['published'], visibility=request.data['visibility'], unlisted=request.data['unlisted'])
                except:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            inbox.posts.add(post)
            return Response(status=status.HTTP_200_OK)
        
        elif type == 'follow':
            # todo: check if author exists, if follow exists. Else create.
            try:
                author = Author.objects.get(id=request.data['actor']['id'])
            except Author.DoesNotExist:
                try:
                    actor = request.data['actor']
                    author = Author.objects.create(id=actor['id'], host=actor['host'], displayName=actor['displayName'], url=actor['url'], github=actor['github'], profileImage=actor['profileImage'])
                except Exception as e:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': str(e)})
            try:
                object = Author.objects.get(id=request.data['object']['id'])
            except Author.DoesNotExist: # local author does not exist
                return Response(status=status.HTTP_404_NOT_FOUND)
            follow = Follow.objects.create(actor=author, object=object, summary=request.data['summary'])
            inbox.requests.add(follow)
            return Response(status=status.HTTP_200_OK)
        
        elif type == 'like':
            # add like to inbox
            # check that author and post of object exists
            try:
                obj = Post.objects.get(id=request.data['object'])
            except Post.DoesNotExist:
                try:
                    obj = Comment.objects.get(id=request.data['object'])
                except Comment.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            try:
                like = Like.objects.create(author=request.data['author'], object=request.data['object'], summary=request.data['summary'])
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST) # probably duplicate
            inbox.likes.add(like)
            return Response(status=status.HTTP_200_OK)
        
        elif type == 'comment':
            # add comment to inbox
            # check that author and post of object exists
            try:
                comment = Comment.objects.get(id=request.data['id'])
            except Comment.DoesNotExist:
                #return Response(status=status.HTTP_404_NOT_FOUND)
                try:
                    post_id = '/'.join((request.data['id']).split('/')[:-2])
                    post = Post.objects.get(id=post_id)
                except Post.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                comment = Comment.objects.create(id=request.data['id'], author=request.data['author'], comment=request.data['comment'], contentType=request.data['contentType'], published=request.data['published'], post=post)
            inbox.comments.add(comment)
            return Response(status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, *args, **kwargs):
        """
        Delete all posts and requests from inbox
        """
        inbox = self.get_queryset()
        inbox.posts.clear()
        inbox.requests.clear()
        inbox.likes.clear()
        inbox.comments.clear()
        return Response(status=status.HTTP_204_NO_CONTENT)


