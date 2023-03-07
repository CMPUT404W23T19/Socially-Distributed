from django.urls import path, include
from .views import AuthorListCreateView, AuthorDetailView, FollowerList, FollowerDetailView

app_name = 'app'

urlpatterns = [
    # gets all user profiles and create a new profile
    path("authors/",AuthorListCreateView.as_view(),name="authors"),
    path("authors/<str:author_id>/",AuthorDetailView.as_view(),name="author"),
    path("authors/<str:author_id>/followers",FollowerList.as_view(),name="followers"),
    path("authors/<str:author_id>/followers/<path:friend_id>",FollowerDetailView.as_view(),name="follower"),
    # path("authors/<str:author_id>/posts",PostList.as_view(),name="posts"),
    # path("authors/<str:author_id>/posts/<str:post_id>",PostDetailView.as_view(),name="post"),
]
