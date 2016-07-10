# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-07-10 14:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0002_auto_20160709_2308'),
    ]

    operations = [
        migrations.AddField(
            model_name='conf',
            name='google_analytics_id',
            field=models.CharField(blank=True, help_text='Enter here you google analytics ID to start tracking.', max_length=254, null=True, verbose_name='Your google analytics ID.'),
        ),
    ]
