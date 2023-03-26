from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Author
from inbox.models import Inbox

HOST = "https://floating-fjord-51978.herokuapp.com"

@receiver(post_save, sender=User)
def create_author(sender, instance, created, **kwargs):
    if created: # if the user is created

        # create an author object
        id_arg = HOST+"/authors/"+str(instance.id)
        url_arg = HOST+"/authors/"+str(instance.id)
        host_arg = HOST
        author_instance = Author.objects.create(user=instance, id=id_arg, url=url_arg, displayName=instance.username, host=host_arg)

        # create inbox for the author
        Inbox.objects.create(author=author_instance)

