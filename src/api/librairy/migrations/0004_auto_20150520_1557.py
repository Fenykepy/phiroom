# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0003_auto_20150513_1603'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='picture',
            options={'get_latest_by': 'importation_date', 'ordering': ['importation_date']},
        ),
        migrations.AlterField(
            model_name='picture',
            name='sha1',
            field=models.CharField(db_index=True, max_length=42),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(verbose_name='Name', max_length=150),
        ),
        migrations.AlterField(
            model_name='tag',
            name='slug',
            field=models.SlugField(verbose_name='Slug', max_length=150),
        ),
    ]
