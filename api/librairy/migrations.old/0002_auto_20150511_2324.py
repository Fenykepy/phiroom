# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='picture',
            options={'ordering': ['importation_date']},
        ),
        migrations.AddField(
            model_name='picture',
            name='previews_path',
            field=models.CharField(blank=True, null=True, max_length=254),
        ),
        migrations.AlterField(
            model_name='collection',
            name='pictures',
            field=models.ManyToManyField(to='librairy.Picture', verbose_name='Pictures', blank=True, through='librairy.Collection_pictures'),
        ),
        migrations.AlterField(
            model_name='picture',
            name='tags',
            field=models.ManyToManyField(to='librairy.PicturesTag', verbose_name='Keywords', blank=True),
        ),
    ]
