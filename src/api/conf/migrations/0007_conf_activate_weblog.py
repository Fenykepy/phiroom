# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-10-08 06:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0006_auto_20160711_1229'),
    ]

    operations = [
        migrations.AddField(
            model_name='conf',
            name='activate_weblog',
            field=models.BooleanField(default=True, help_text='Uncheck to desactivate webgo.', verbose_name='Activate weblog'),
        ),
    ]
