from django.urls import path, include
from .views import InboxView
from rest_framework import routers

app_name = 'posts'

urlpatterns = [
    path("authors/<str:author_id>/inbox", InboxView.as_view(),name="inbox"),
]