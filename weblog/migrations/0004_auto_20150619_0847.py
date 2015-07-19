# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('weblog', '0003_remove_post_absolute_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(verbose_name='Publication date', default=datetime.datetime(2015, 6, 19, 6, 47, 35, 792697, tzinfo=utc), db_index=True, blank=True),
            preserve_default=False,
        ),
    ]
