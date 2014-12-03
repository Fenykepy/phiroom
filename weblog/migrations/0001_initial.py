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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('title', models.CharField(max_length=254, verbose_name='Title')),
                ('slug', models.SlugField(max_length=270)),
                ('description', models.TextField(help_text='Description of the post, in one sentence, some kind of subtitle.', null=True, blank=True, verbose_name='Description')),
                ('abstract', models.TextField(null=True, blank=True, verbose_name='Abstract')),
                ('content', models.TextField(null=True, blank=True, verbose_name='Content')),
                ('source', models.TextField(null=True, blank=True, verbose_name='Post content, in markdown')),
                ('draft', models.BooleanField(db_index=True, default=False, verbose_name='Draft')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='First redaction date')),
                ('update_date', models.DateTimeField(auto_now=True, auto_now_add=True, verbose_name='Last modification date')),
                ('pub_date', models.DateTimeField(db_index=True, blank=True, verbose_name='Publication date')),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(unique=True, max_length=50, verbose_name='Tag')),
                ('slug', models.SlugField(unique=True, max_length=65)),
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
            field=models.ManyToManyField(to='weblog.Tag', verbose_name='Tags'),
            preserve_default=True,
        ),
    ]
