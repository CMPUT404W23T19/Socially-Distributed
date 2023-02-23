from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100, blank=True, null=True)
    host = models.CharField(max_length=100)
    github = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.CharField(max_length=100, blank=True, null=True)
    url = models.CharField(max_length=100)
    id = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.user.username

