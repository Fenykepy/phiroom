# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='description',
            options={'get_latest_by': 'date_update', 'ordering': ['date_update']},
        ),
    ]
