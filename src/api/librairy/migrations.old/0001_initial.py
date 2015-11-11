# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import librairy.models
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Collection')),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug')),
                ('n_pict', models.PositiveIntegerField(default=0, verbose_name='Pictures number')),
            ],
        ),
        migrations.CreateModel(
            name='Collection_pictures',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('order', models.IntegerField(default=0)),
                ('collection', models.ForeignKey(to='librairy.Collection')),
            ],
            options={
                'ordering': ('order',),
            },
        ),
        migrations.CreateModel(
            name='CollectionsEnsemble',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Ensemble de collection')),
                ('slug', models.SlugField(max_length=150, verbose_name='slug')),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('parent', models.ForeignKey(to='librairy.CollectionsEnsemble', blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Directory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Name')),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug')),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('parent', mptt.fields.TreeForeignKey(to='librairy.Directory', blank=True, null=True, related_name='Children')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Name')),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug')),
                ('color', models.CharField(max_length=7, default='#CB5151', verbose_name='Color')),
            ],
        ),
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('importation_date', models.DateTimeField(verbose_name='Importation date', auto_now_add=True)),
                ('last_update', models.DateTimeField(verbose_name='Last update date', auto_now=True)),
                ('sha1', models.CharField(db_index=True, max_length=42, unique=True)),
                ('source_file', models.ImageField(upload_to=librairy.models.set_picturename, storage=librairy.models.PictureFileSystemStorage())),
                ('title', models.CharField(max_length=140, verbose_name='Title', blank=True, null=True)),
                ('legend', models.TextField(blank=True, verbose_name='Legend', null=True)),
                ('name_import', models.CharField(max_length=140, verbose_name='Importation name')),
                ('name', models.CharField(max_length=140, verbose_name='Name')),
                ('type', models.CharField(max_length=30, verbose_name='File type')),
                ('weight', models.PositiveIntegerField(verbose_name='File weight')),
                ('width', models.PositiveIntegerField(verbose_name='File width')),
                ('height', models.PositiveIntegerField(verbose_name='File height')),
                ('portrait_orientation', models.BooleanField(verbose_name='Portrait orientation')),
                ('landscape_orientation', models.BooleanField(verbose_name='Landscape orientation')),
                ('color', models.BooleanField(default=True, verbose_name='Color picture')),
                ('camera', models.CharField(max_length=300, verbose_name='Camera model', blank=True, null=True)),
                ('lens', models.CharField(max_length=300, verbose_name='Lens model', blank=True, null=True)),
                ('speed', models.CharField(max_length=30, verbose_name='Shutter speed', blank=True, null=True)),
                ('aperture', models.CharField(max_length=30, verbose_name='Aperture', blank=True, null=True)),
                ('iso', models.PositiveSmallIntegerField(blank=True, verbose_name='Iso sensibility', null=True)),
                ('rate', models.PositiveSmallIntegerField(default=0, verbose_name='Rating')),
                ('exif_date', models.DateTimeField(blank=True, verbose_name='Exif date', null=True)),
                ('exif_origin_date', models.DateTimeField(blank=True, verbose_name='Exif origin date', null=True)),
                ('copyright', models.CharField(max_length=300, blank=True, null=True)),
                ('copyright_state', models.CharField(max_length=30, verbose_name='Copyright state', blank=True, null=True)),
                ('copyright_description', models.TextField(blank=True, verbose_name='Copyright description', null=True)),
                ('copyright_url', models.URLField(verbose_name='Copyright url', blank=True, null=True)),
                ('directory', models.ForeignKey(verbose_name='Folder', to='librairy.Directory')),
                ('label', models.ForeignKey(to='librairy.Label', blank=True, verbose_name='Label', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PicturesTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=150, verbose_name='Name', unique=True)),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug', unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='picture',
            name='tags',
            field=models.ManyToManyField(blank=True, verbose_name='Keywords', null=True, to='librairy.PicturesTag'),
        ),
        migrations.AddField(
            model_name='collection_pictures',
            name='picture',
            field=models.ForeignKey(to='librairy.Picture'),
        ),
        migrations.AddField(
            model_name='collection',
            name='ensemble',
            field=models.ForeignKey(to='librairy.CollectionsEnsemble', blank=True, null=True),
        ),
        migrations.AddField(
            model_name='collection',
            name='pictures',
            field=models.ManyToManyField(through='librairy.Collection_pictures', blank=True, verbose_name='Pictures', null=True, to='librairy.Picture'),
        ),
        migrations.AlterUniqueTogether(
            name='collectionsensemble',
            unique_together=set([('name', 'parent')]),
        ),
        migrations.AlterUniqueTogether(
            name='collection',
            unique_together=set([('name', 'ensemble')]),
        ),
    ]
