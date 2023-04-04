from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    type = 'author'
    displayName = models.CharField(max_length=100, blank=True, null=True)
    host = models.CharField(max_length=100)
    github = models.CharField(max_length=100, blank=True, null=True)
    profileImage = models.CharField(max_length=500, blank=True, null=True)
    url = models.CharField(max_length=200)
    id = models.CharField(max_length=200, primary_key=True)
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True)

    def __str__(self):
        return self.user.username
    
class Follow(models.Model):
    type = 'follow'
    summary = models.CharField(max_length=500, blank=True, null=True)
    actor = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='actor')
    object = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='object')
