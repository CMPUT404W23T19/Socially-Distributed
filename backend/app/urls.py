from django.urls import path, include
from .views import AuthorListCreateView, AuthorDetailView, FollowerList

app_name = 'app'

urlpatterns = [
    # gets all user profiles and create a new profile
    path("authors",AuthorListCreateView.as_view(),name="authors"),
    path("authors/<int:pk>",AuthorDetailView.as_view(),name="author"),
    path("authors/<int:author_id>/followers",FollowerList.as_view(),name="followers"),
]
