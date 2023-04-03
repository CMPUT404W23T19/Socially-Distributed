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
    categories = models.CharField(max_length=100, blank=True, null=True)
    count = models.IntegerField(default=0)
    comments = models.CharField(max_length=100, blank=True, null=True)
    published = models.CharField(max_length=100)
    visibility = models.CharField(max_length=100) # probably make this a choice field
    unlisted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
class Like(models.Model):
    type = 'like'
    summary = models.CharField(max_length=100)
    actor = models.ForeignKey(Author, on_delete=models.CASCADE)
    object = models.CharField(max_length=200)
    
    def __str__(self):
        return self.summary
    
    class Meta:
        unique_together = ('actor', 'object')
    
class Comment(models.Model):
    """
    author, comment and contentType required
    """
    type = 'comment'
    id = models.CharField(max_length=200, primary_key=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()
    contentType = models.CharField(max_length=100) # probably make this a choice field
    published = models.CharField(max_length=100)
    
    def __str__(self):
        return self.comment
