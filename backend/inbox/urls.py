from django.urls import path, include
from .views import InboxView
from rest_framework import routers

urlpatterns = [
    path("authors/<str:author_id>/inbox", InboxView.as_view(),name="inbox"),
]