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
    contentType = models.CharField(max_length=100) # probably make this a choice field
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    categories = models.CharField(max_length=100)
    count = models.IntegerField()
    comments = models.CharField(max_length=100, blank=True, null=True)
    published = models.CharField(max_length=100)
    visibility = models.CharField(max_length=100) # probably make this a choice field
    unlisted = models.BooleanField()
    
    def __str__(self):
        return self.title
