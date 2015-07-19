# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0005_auto_20150526_1132'),
        ('weblog', '0004_auto_20150619_0847'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostPicture',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('order', models.IntegerField(default=0)),
                ('picture', models.ForeignKey(to='librairy.Picture')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.AlterField(
            model_name='post',
            name='slug',
            field=models.CharField(unique=True, db_index=True, max_length=270),
        ),
        migrations.AddField(
            model_name='postpicture',
            name='post',
            field=models.ForeignKey(to='weblog.Post'),
        ),
        migrations.AddField(
            model_name='post',
            name='pictures',
            field=models.ManyToManyField(blank=True, to='librairy.Picture', verbose_name='Pictures', through='weblog.PostPicture'),
        ),
    ]
