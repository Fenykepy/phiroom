# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('weblog', '0002_auto_20150508_1854'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='absolute_url',
        ),
    ]
