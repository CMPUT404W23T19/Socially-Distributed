from django.db import models
from posts.models import Post
from app.models import Author

# Create your models here.

class Inbox(models.Model):
    type = 'inbox'
    author = models.OneToOneField(Author, on_delete=models.CASCADE)
    posts = models.ManyToManyField(Post, blank=True, related_name='posts')
    requests = models.ManyToManyField(Author, blank=True, related_name='requests')

    def __str__(self):
        return self.author.user.username
