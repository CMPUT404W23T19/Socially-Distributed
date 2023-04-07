from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.test import TestCase
from common.logging.logging_service import Logger
import json

class InboxTestCase(APITestCase):
    """
    Tests for the API endpoints that are related to inbox.
    """
    author_list_url=reverse('authors')  # actual url for the author list
    def setUp(self):
        # create a new user making a post request to djoser endpoint
        self.user=self.client.post('/auth/users/',data={'username':'mario','password':'i-keep-jumping'})
        # obtain a json web token for the newly created user
        response=self.client.post('/auth/jwt/create/',data={'username':'mario','password':'i-keep-jumping'})
        self.token=response.data['access']
        self.api_authentication()
        response = self.client.get('/auth/users/me/')  # get id of newly made user
        padded_id = str(response.data['id']).zfill(12)
        self.id = "00000000-0000-0000-0000-"+padded_id
        self.author=self.client.get(reverse('author',kwargs={'author_id':self.id})) # get author
        self.author=self.author.data
        # Logger().info(self.author)

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token '+self.token)

    def test_get_inbox(self):
        response=self.client.get(reverse('inbox',kwargs={'author_id':self.id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
    # send post to inbox
    def test_post_to_inbox(self):
        post_data={'title':'test post','source':'me','origin':'me','description':'this is a test post','content':'this is a test post','contentType':'text/plain','categories':'test','visibility':'PUBLIC','unlisted':False, 'author':json.dumps(self.author)}
        response=self.client.post(reverse('posts', kwargs={'author_id':self.id}),data=post_data)
        response=self.client.get(reverse('posts', kwargs={'author_id':self.id}))
        self.post = response.data['items'][0]
        self.post=dict(self.post)
        response = self.client.post(reverse('inbox', kwargs={'author_id':self.id}), data=self.post, format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # send comment to inbox
    def test_post_comment_to_inbox(self):
        post_data={'title':'test post','source':'me','origin':'me','description':'this is a test post','content':'this is a test post','contentType':'text/plain','categories':'test','visibility':'PUBLIC','unlisted':False, 'author':json.dumps(self.author)}
        response=self.client.post(reverse('posts', kwargs={'author_id':self.id}),data=post_data)
        response=self.client.get(reverse('posts', kwargs={'author_id':self.id}))
        self.post = response.data['items'][0]
        comment_data={'type':'comment','comment':'this is a test comment','contentType':'text/plain','author':self.author,'id':(str(self.post['id'])+'/comments/1')}
        response=self.client.post(reverse('inbox', kwargs={'author_id':self.id}),data=comment_data, format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # send like to inbox
    def test_post_like_to_inbox(self):
        post_data={'title':'test post','source':'me','origin':'me','description':'this is a test post','content':'this is a test post','contentType':'text/plain','categories':'test','visibility':'PUBLIC','unlisted':False, 'author':json.dumps(self.author)}
        response=self.client.post(reverse('posts', kwargs={'author_id':self.id}),data=post_data)
        response=self.client.get(reverse('posts', kwargs={'author_id':self.id}))
        self.post = response.data['items'][0]
        like_data={'type':'like','author':self.author,'object':str(self.post['id']),'summary':'mario likes this post'}
        response=self.client.post(reverse('inbox', kwargs={'author_id':self.id}),data=like_data, format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # send friend request to inbox
    def test_post_friend_request_to_inbox(self):
        actor = {
        "type":"author",
        "id":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
        "url":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
        "host":"http://127.0.0.1:5454/",
        "displayName":"Greg Johnson",
        "github": "http://github.com/gjohnson",
        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
        }
        friend_request_data={'type':'follow','object':self.author,'actor':actor,'summary':'mario wants to be friends with you'}
        response=self.client.post(reverse('inbox', kwargs={'author_id':self.id}),data=friend_request_data, format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
