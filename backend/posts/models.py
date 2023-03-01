from django.db import models
from app.models import Author

# Create your models here.

class Post(models.Model):
    type = 'post'
    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    origin = models.CharField(max_length=100)
    description = models.CharField(max_length=400)
    contentType = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    categories = models.CharField(max_length=100)
    count = models.IntegerField()
    published = models.DateTimeField()
    visibility = models.CharField(max_length=100)
    unlisted = models.BooleanField()
    
    def __str__(self):
        return self.title
