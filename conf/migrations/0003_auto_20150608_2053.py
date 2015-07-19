# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0002_auto_20150527_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conf',
            name='librairy_logo',
            field=models.ImageField(upload_to='images/logos/', blank=True, null=True, default='images/default/librairy_default_logo.png', verbose_name="Librairy's logo.", help_text='The logo you can see on librairy page header.                     Idealy 50px height.                     Leave blank to use default one.'),
        ),
    ]
