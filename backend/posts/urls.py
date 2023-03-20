from django.urls import path, include
from .views import PostList, PostDetailView, GetImageView, PostLikes, CommentLikes, AuthorLiked, CommentsView

# app_name = 'posts'

urlpatterns = [
    path("authors/<str:author_id>/posts/",PostList.as_view(),name="posts"),
    path("authors/<str:author_id>/posts/<str:post_id>", PostDetailView.as_view(),name="post"),
    path("authors/<str:author_id>/posts/<str:post_id>/image", GetImageView.as_view(), name="post_image"),
    path("authors/<str:author_id>/posts/<str:post_id>/comments", CommentsView.as_view(), name="comments"),
    path("authors/<str:author_id>/posts/<str:post_id>/likes", PostLikes.as_view(), name="post_likes"),
    path("authors/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes", CommentLikes.as_view(), name="comment_likes"),
    path("authors/<str:author_id>/liked", AuthorLiked.as_view(), name="author_liked"), 
]