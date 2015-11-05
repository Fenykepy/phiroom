# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='picture',
            name='height',
            field=models.PositiveIntegerField(null=True, blank=True, verbose_name='File height'),
        ),
        migrations.AlterField(
            model_name='picture',
            name='rate',
            field=models.PositiveSmallIntegerField(null=True, default=0, blank=True, verbose_name='Rating'),
        ),
        migrations.AlterField(
            model_name='picture',
            name='type',
            field=models.CharField(max_length=30, null=True, blank=True, verbose_name='File type'),
        ),
        migrations.AlterField(
            model_name='picture',
            name='weight',
            field=models.PositiveIntegerField(null=True, blank=True, verbose_name='File weight'),
        ),
        migrations.AlterField(
            model_name='picture',
            name='width',
            field=models.PositiveIntegerField(null=True, blank=True, verbose_name='File width'),
        ),
    ]
