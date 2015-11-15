# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0005_auto_20150526_1132'),
    ]

    operations = [
        migrations.AddField(
            model_name='picture',
            name='ratio',
            field=models.FloatField(blank=True, verbose_name='Image ratio (width / height)', null=True),
        ),
    ]
