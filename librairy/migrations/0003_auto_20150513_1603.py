# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0002_auto_20150513_1544'),
    ]

    operations = [
        migrations.AlterField(
            model_name='picture',
            name='sha1',
            field=models.CharField(max_length=42),
        ),
    ]
