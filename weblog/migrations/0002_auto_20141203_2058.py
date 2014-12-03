# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('weblog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='absolute_url',
            field=models.URLField(default='.', verbose_name='Post url'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='post',
            name='description',
            field=models.CharField(max_length=254, verbose_name='Description', blank=True, help_text='Description of the post, in one sentence, some kind of subtitle.', null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='slug',
            field=models.CharField(max_length=270, db_index=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(verbose_name='Tags', to='weblog.Tag', blank=True, null=True),
        ),
    ]
