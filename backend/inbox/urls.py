from django.urls import path, include
from .views import InboxView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'posts', InboxView)

app_name = 'posts'

urlpatterns = [
    path("authors/<str:author_id>/inbox", include(router.urls),name="inbox"),
]