# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-18 18:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0013_auto_20160318_1938'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectionsensemble',
            name='parent',
            field=models.ForeignKey(blank=True, default=1, null=True, on_delete=django.db.models.deletion.CASCADE, to='librairy.CollectionsEnsemble'),
        ),
    ]
