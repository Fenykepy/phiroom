# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_auto_20151115_0939'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='portfoliopicture',
            options={'ordering': ['order']},
        ),
    ]
