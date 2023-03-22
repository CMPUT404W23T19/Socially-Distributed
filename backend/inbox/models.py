from django.db import models
from posts.models import Post, Like, Comment
from app.models import Author, Follow

# Create your models here.

class Inbox(models.Model):
    type = 'inbox'
    author = models.OneToOneField(Author, on_delete=models.CASCADE)
    posts = models.ManyToManyField(Post, blank=True, related_name='posts')
    requests = models.ManyToManyField(Follow, blank=True, related_name='requests')
    likes = models.ManyToManyField(Like, blank=True, related_name='likes')
    comments = models.ManyToManyField(Comment, blank=True, related_name='comments')

    def __str__(self):
        return self.author.user.username
