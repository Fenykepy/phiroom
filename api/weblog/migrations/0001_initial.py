# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=254, verbose_name='Title')),
                ('slug', models.CharField(max_length=270, db_index=True)),
                ('description', models.CharField(blank=True, max_length=254, help_text='Description of the post, in one sentence, some kind of subtitle.', null=True, verbose_name='Description')),
                ('abstract', models.TextField(blank=True, null=True, verbose_name='Abstract')),
                ('content', models.TextField(blank=True, null=True, verbose_name='Content')),
                ('source', models.TextField(blank=True, null=True, verbose_name='Post content, in markdown')),
                ('draft', models.BooleanField(verbose_name='Draft', db_index=True, default=False)),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='First redaction date')),
                ('update_date', models.DateTimeField(auto_now=True, auto_now_add=True, verbose_name='Last modification date')),
                ('pub_date', models.DateTimeField(blank=True, verbose_name='Publication date', null=True, db_index=True)),
                ('absolute_url', models.URLField(blank=True, null=True, verbose_name='Post url')),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-pub_date'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Tag')),
                ('slug', models.SlugField(max_length=65, unique=True)),
                ('n_posts', models.IntegerField(db_index=True, default=0)),
            ],
            options={
                'ordering': ['name'],
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(blank=True, to='weblog.Tag', null=True, verbose_name='Tags'),
            preserve_default=True,
        ),
    ]
