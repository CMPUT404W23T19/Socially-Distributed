# Generated by Django 4.0.5 on 2023-02-23 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('type', models.CharField(max_length=100)),
                ('display_name', models.CharField(blank=True, max_length=100, null=True)),
                ('host', models.CharField(max_length=100)),
                ('github', models.CharField(blank=True, max_length=100, null=True)),
                ('profile_image', models.CharField(blank=True, max_length=100, null=True)),
                ('url', models.CharField(max_length=100)),
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]