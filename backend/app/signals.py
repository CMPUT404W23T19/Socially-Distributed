from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Author


@receiver(post_save, sender=User)
def create_author(sender, instance, created, **kwargs):
    if created:
        Author.objects.create(user=instance, id="http://127.0.0.1:8000/authors/"+instance.id, url="http://127.0.0.1:8000/authors/"+instance.id, type="author", display_name=instance.username, host="http://127.0.0.1:8000")
