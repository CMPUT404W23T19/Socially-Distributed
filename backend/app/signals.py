from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Author


@receiver(post_save, sender=User)
def create_author(sender, instance, created, **kwargs):
    if created:
        print("created")
        id_arg = "http://127.0.0.1:8000/authors/"+str(instance.id)
        url_arg = "http://127.0.0.1:8000/authors/"+str(instance.id)
        host_arg = "http://127.0.0.1:8000"
        Author.objects.create(user=instance, id=id_arg, url=url_arg, display_name=instance.username, host=host_arg)

