from django.urls import path, include
from .views import PostList, PostDetailView, GetImageView

# app_name = 'posts'

urlpatterns = [
    path("authors/<str:author_id>/posts/",PostList.as_view(),name="posts"),
    path("authors/<str:author_id>/posts/<str:post_id>", PostDetailView.as_view(),name="post"),
    path("authors/<str:author_id>/posts/<str:post_id>/image", GetImageView.as_view(), name="post_image"),
]