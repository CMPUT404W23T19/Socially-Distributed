# Generated by Django 4.0.5 on 2023-04-03 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_rename_actor_like_author_alter_like_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='published',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='post',
            name='categories',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='comments',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='id',
            field=models.CharField(max_length=200, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='post',
            name='origin',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='post',
            name='published',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='post',
            name='source',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=200),
        ),
    ]