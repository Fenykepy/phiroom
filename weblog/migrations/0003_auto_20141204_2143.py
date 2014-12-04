# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('weblog', '0002_auto_20141203_2058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='absolute_url',
            field=models.URLField(verbose_name='Post url', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(verbose_name='Publication date', null=True, blank=True, db_index=True),
        ),
    ]
