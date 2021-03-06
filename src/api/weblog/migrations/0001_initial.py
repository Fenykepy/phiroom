# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-07-02 14:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('librairy', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=254, verbose_name='Title')),
                ('slug', models.CharField(db_index=True, max_length=270, unique=True)),
                ('description', models.CharField(blank=True, help_text='Description of the post, in one sentence, some kind of subtitle.', max_length=254, null=True, verbose_name='Description')),
                ('abstract', models.TextField(blank=True, null=True, verbose_name='Abstract')),
                ('content', models.TextField(blank=True, null=True, verbose_name='Content')),
                ('source', models.TextField(blank=True, null=True, verbose_name='Post content, in markdown')),
                ('draft', models.BooleanField(db_index=True, default=False, verbose_name='Draft')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='First redaction date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='Last modification date')),
                ('pub_date', models.DateTimeField(blank=True, db_index=True, verbose_name='Publication date')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-pub_date'],
            },
        ),
        migrations.CreateModel(
            name='PostPicture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(default=0)),
                ('picture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='librairy.Picture')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weblog.Post')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Tag')),
                ('slug', models.SlugField(max_length=65, unique=True)),
                ('n_posts', models.IntegerField(db_index=True, default=0)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='post',
            name='pictures',
            field=models.ManyToManyField(blank=True, through='weblog.PostPicture', to='librairy.Picture', verbose_name='Pictures'),
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(blank=True, to='weblog.Tag', verbose_name='Tags'),
        ),
        migrations.AlterUniqueTogether(
            name='postpicture',
            unique_together=set([('post', 'picture')]),
        ),
    ]
