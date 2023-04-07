from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.test import TestCase
from common.logging.logging_service import Logger

class AuthorTestCase(APITestCase):
    """
    Tests for the API endpoints that are related to auhtors.
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

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token '+self.token)

    # retrieve a list of all authors while the request user is authenticated
    def test_author_list_authenticated(self):
        response=self.client.get(self.author_list_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # check to retrieve the author details of the authenticated user
    def test_author_detail_retrieve(self):
        response=self.client.get(reverse('author',kwargs={'author_id':self.id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # populate the author profile that was automatically created using the signals
    def test_author_populate(self):
        author_data={'github':'https://github.com/'}
        response=self.client.post(reverse('author',kwargs={'author_id':self.id}),data=author_data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # test adding a user with a name that already exists
    def test_author_already_exists(self):
        response = self.client.post('/auth/users/',data={'username':'mario','password':'i-keep-jumping'})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
