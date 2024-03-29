# Generated by Django 4.0.5 on 2023-03-28 22:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app', '0001_initial'),
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
                ('categories', models.CharField(blank=True, max_length=100, null=True)),
                ('count', models.IntegerField(default=0)),
                ('comments', models.CharField(blank=True, max_length=100, null=True)),
                ('published', models.CharField(max_length=100)),
                ('visibility', models.CharField(max_length=100)),
                ('unlisted', models.BooleanField(default=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.author')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('comment', models.TextField()),
                ('contentType', models.CharField(max_length=100)),
                ('published', models.CharField(max_length=100)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.CharField(max_length=100)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.author')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post')),
            ],
            options={
                'unique_together': {('actor', 'object')},
            },
        ),
    ]
