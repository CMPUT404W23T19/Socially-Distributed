# Generated by Django 4.0.5 on 2023-02-28 21:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app', '0003_remove_author_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('source', models.CharField(max_length=100)),
                ('origin', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=400)),
                ('contentType', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('categories', models.CharField(max_length=100)),
                ('count', models.IntegerField()),
                ('published', models.DateTimeField()),
                ('visibility', models.CharField(max_length=100)),
                ('unlisted', models.BooleanField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.author')),
            ],
        ),
    ]
