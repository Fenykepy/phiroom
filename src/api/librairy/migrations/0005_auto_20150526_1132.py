# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0004_auto_20150520_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='directory',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, to='librairy.Directory', related_name='children', null=True),
        ),
    ]
