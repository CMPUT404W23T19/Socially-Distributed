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
        self.id = str(response.data['id'])
        self.author=self.client.get(reverse('author',kwargs={'author_id':self.id})) # get author
        self.author=self.author.data
        # Logger().info(self.author)

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token '+self.token)

    def test_get_inbox(self):
        response=self.client.get(reverse('inbox',kwargs={'author_id':self.id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
    def test_post_to_inbox(self):
        post_data={'title':'test post','source':'me','origin':'me','description':'this is a test post','content':'this is a test post','contentType':'text/plain','categories':'test','visibility':'PUBLIC','unlisted':False, 'author':json.dumps(self.author)}
        response=self.client.post(reverse('posts', kwargs={'author_id':self.id}),data=post_data)
        response=self.client.get(reverse('posts', kwargs={'author_id':self.id}))
        self.post = response.data['items'][0]
        self.post=dict(self.post)
        response = self.client.post(reverse('inbox', kwargs={'author_id':self.id}), data=self.post, format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
