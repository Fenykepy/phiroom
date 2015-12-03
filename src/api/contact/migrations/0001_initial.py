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
            name='Description',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('title', models.CharField(max_length=254, verbose_name='Title')),
                ('content', models.TextField(null=True, verbose_name='Description')),
                ('source', models.TextField(null=True, verbose_name='Source')),
                ('date_update', models.DateTimeField(db_index=True, verbose_name='Last update date', auto_now=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL, blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=254, verbose_name='Name')),
                ('mail', models.EmailField(max_length=254, verbose_name='Mail')),
                ('website', models.URLField(blank=True, null=True, verbose_name='Website')),
                ('subject', models.CharField(max_length=254, verbose_name='Subject')),
                ('message', models.TextField(verbose_name='Message')),
                ('forward', models.BooleanField(default=True, verbose_name='Forward')),
                ('date', models.DateTimeField(verbose_name='Send date', auto_now=True)),
                ('ip', models.GenericIPAddressField(blank=True, null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, blank=True, null=True)),
            ],
        ),
    ]
