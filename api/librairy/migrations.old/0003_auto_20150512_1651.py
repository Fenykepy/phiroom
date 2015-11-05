# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0002_auto_20150511_2324'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Name', unique=True)),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug', unique=True)),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('parent', models.ForeignKey(to='librairy.Tag', null=True, blank=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.DeleteModel(
            name='PicturesTag',
        ),
        migrations.AlterField(
            model_name='picture',
            name='landscape_orientation',
            field=models.BooleanField(verbose_name='Landscape orientation', default=False),
        ),
        migrations.AlterField(
            model_name='picture',
            name='portrait_orientation',
            field=models.BooleanField(verbose_name='Portrait orientation', default=False),
        ),
        migrations.AlterField(
            model_name='picture',
            name='tags',
            field=models.ManyToManyField(to='librairy.Tag', verbose_name='Keywords', blank=True),
        ),
        migrations.AlterUniqueTogether(
            name='tag',
            unique_together=set([('parent', 'name')]),
        ),
    ]
