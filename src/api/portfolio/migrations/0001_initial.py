# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0005_auto_20150526_1132'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('title', models.CharField(verbose_name='Title', max_length=254)),
                ('slug', models.CharField(db_index=True, unique=True, max_length=270)),
                ('draft', models.BooleanField(verbose_name='Draft', db_index=True, default=False)),
                ('create_date', models.DateTimeField(verbose_name='Creation date', auto_now_add=True)),
                ('update_date', models.DateTimeField(verbose_name='Last modification date', auto_now=True)),
                ('pub_date', models.DateTimeField(verbose_name='Publication date', db_index=True, blank=True)),
                ('order', models.IntegerField(default=0)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='PortfolioPicture',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('order', models.IntegerField(default=0)),
                ('picture', models.ForeignKey(to='librairy.Picture')),
                ('portfolio', models.ForeignKey(to='portfolio.Portfolio')),
            ],
        ),
        migrations.AddField(
            model_name='portfolio',
            name='pictures',
            field=models.ManyToManyField(verbose_name='Pictures', to='librairy.Picture', through='portfolio.PortfolioPicture', blank=True),
        ),
    ]
