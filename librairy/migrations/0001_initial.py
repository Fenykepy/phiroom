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
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('name', models.CharField(verbose_name='Collection', max_length=150)),
                ('slug', models.SlugField(verbose_name='Slug', max_length=150)),
                ('n_pict', models.PositiveIntegerField(verbose_name='Pictures number', default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Collection_pictures',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
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
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('name', models.CharField(verbose_name='Ensemble de collection', max_length=150)),
                ('slug', models.SlugField(verbose_name='slug', max_length=150)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', models.ForeignKey(null=True, to='librairy.CollectionsEnsemble', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Directory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('name', models.CharField(verbose_name='Name', max_length=150)),
                ('slug', models.SlugField(verbose_name='Slug', max_length=150)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', mptt.fields.TreeForeignKey(null=True, related_name='Children', to='librairy.Directory', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('name', models.CharField(verbose_name='Name', max_length=150)),
                ('slug', models.SlugField(verbose_name='Slug', max_length=150)),
                ('color', models.CharField(verbose_name='Color', max_length=7, default='#CB5151')),
            ],
        ),
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('importation_date', models.DateTimeField(verbose_name='Importation date', auto_now_add=True)),
                ('last_update', models.DateTimeField(verbose_name='Last update date', auto_now=True)),
                ('sha1', models.CharField(max_length=42, unique=True, db_index=True)),
                ('source_file', models.ImageField(storage=librairy.models.PictureFileSystemStorage(), upload_to=librairy.models.set_picturename)),
                ('previews_path', models.CharField(max_length=254, null=True, blank=True)),
                ('title', models.CharField(verbose_name='Title', max_length=140, null=True, blank=True)),
                ('legend', models.TextField(verbose_name='Legend', null=True, blank=True)),
                ('name_import', models.CharField(verbose_name='Importation name', max_length=140)),
                ('name', models.CharField(verbose_name='Name', max_length=140)),
                ('type', models.CharField(verbose_name='File type', max_length=30)),
                ('weight', models.PositiveIntegerField(verbose_name='File weight')),
                ('width', models.PositiveIntegerField(verbose_name='File width')),
                ('height', models.PositiveIntegerField(verbose_name='File height')),
                ('portrait_orientation', models.BooleanField(verbose_name='Portrait orientation', default=False)),
                ('landscape_orientation', models.BooleanField(verbose_name='Landscape orientation', default=False)),
                ('color', models.BooleanField(verbose_name='Color picture', default=True)),
                ('camera', models.CharField(verbose_name='Camera model', max_length=300, null=True, blank=True)),
                ('lens', models.CharField(verbose_name='Lens model', max_length=300, null=True, blank=True)),
                ('speed', models.CharField(verbose_name='Shutter speed', max_length=30, null=True, blank=True)),
                ('aperture', models.CharField(verbose_name='Aperture', max_length=30, null=True, blank=True)),
                ('iso', models.PositiveSmallIntegerField(verbose_name='Iso sensibility', null=True, blank=True)),
                ('rate', models.PositiveSmallIntegerField(verbose_name='Rating', default=0)),
                ('exif_date', models.DateTimeField(verbose_name='Exif date', null=True, blank=True)),
                ('exif_origin_date', models.DateTimeField(verbose_name='Exif origin date', null=True, blank=True)),
                ('copyright', models.CharField(max_length=300, null=True, blank=True)),
                ('copyright_state', models.CharField(verbose_name='Copyright state', max_length=30, null=True, blank=True)),
                ('copyright_description', models.TextField(verbose_name='Copyright description', null=True, blank=True)),
                ('copyright_url', models.URLField(verbose_name='Copyright url', null=True, blank=True)),
                ('directory', models.ForeignKey(null=True, verbose_name='Folder', to='librairy.Directory', blank=True)),
                ('label', models.ForeignKey(null=True, verbose_name='Label', to='librairy.Label', blank=True)),
            ],
            options={
                'ordering': ['importation_date'],
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('name', models.CharField(verbose_name='Name', unique=True, max_length=150)),
                ('slug', models.SlugField(max_length=150, verbose_name='Slug', unique=True)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', models.ForeignKey(null=True, to='librairy.Tag', blank=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='picture',
            name='tags',
            field=models.ManyToManyField(verbose_name='Keywords', to='librairy.Tag', blank=True),
        ),
        migrations.AddField(
            model_name='collection_pictures',
            name='picture',
            field=models.ForeignKey(to='librairy.Picture'),
        ),
        migrations.AddField(
            model_name='collection',
            name='ensemble',
            field=models.ForeignKey(null=True, to='librairy.CollectionsEnsemble', blank=True),
        ),
        migrations.AddField(
            model_name='collection',
            name='pictures',
            field=models.ManyToManyField(verbose_name='Pictures', through='librairy.Collection_pictures', to='librairy.Picture', blank=True),
        ),
        migrations.AlterUniqueTogether(
            name='tag',
            unique_together=set([('parent', 'name')]),
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
