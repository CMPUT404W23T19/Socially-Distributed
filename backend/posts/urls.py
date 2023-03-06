from django.urls import path, include
from .views import PostList, PostDetailView
from rest_framework import routers

app_name = 'posts'

urlpatterns = [
    path("authors/<str:author_id>/posts/",PostList.as_view(),name="posts"),
    path("authors/<str:author_id>/posts/<str:post_id>", PostDetailView.as_view(),name="post"),
]