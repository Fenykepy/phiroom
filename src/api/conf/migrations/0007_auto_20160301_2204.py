# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-01 21:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0006_auto_20160229_1302'),
    ]

    operations = [
        migrations.AddField(
            model_name='conf',
            name='carousel_default_height',
            field=models.PositiveIntegerField(default=600, verbose_name='Max height of carousels.'),
        ),
        migrations.AlterField(
            model_name='conf',
            name='abstract_replaced_chars',
            field=models.CharField(default=',.!?…', help_text='List of characters that will be replaced by abstract last                     character if they end abstract.', max_length=254, verbose_name='Abstract replaced characters'),
        ),
    ]
