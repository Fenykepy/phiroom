# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Picture'
        db.create_table('librairy_picture', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=140, blank=True, null=True)),
            ('legend', self.gf('django.db.models.fields.TextField')(blank=True, null=True)),
            ('name_import', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('name_origin', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('directory', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['librairy.Directory'])),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('size', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('width', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('height', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('color', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('camera', self.gf('django.db.models.fields.CharField')(max_length=140, blank=True, null=True)),
            ('lens', self.gf('django.db.models.fields.CharField')(max_length=140, blank=True, null=True)),
            ('speed', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True, null=True)),
            ('aperture', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True, null=True)),
            ('iso', self.gf('django.db.models.fields.PositiveSmallIntegerField')(blank=True, null=True)),
            ('note', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('label', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, null=True, to=orm['librairy.Label'])),
            ('licence', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, null=True, to=orm['librairy.Licence'])),
            ('md5', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('nbr_read', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('date_import', self.gf('django.db.models.fields.DateTimeField')(blank=True, auto_now_add=True)),
            ('date_update', self.gf('django.db.models.fields.DateTimeField')(blank=True, auto_now_add=True, auto_now=True)),
            ('date_origin', self.gf('django.db.models.fields.DateTimeField')(blank=True, null=True)),
            ('date', self.gf('django.db.models.fields.DateTimeField')(blank=True, null=True)),
        ))
        db.send_create_signal('librairy', ['Picture'])

        # Adding unique constraint on 'Picture', fields ['directory', 'name']
        db.create_unique('librairy_picture', ['directory_id', 'name'])

        # Adding M2M table for field tags on 'Picture'
        m2m_table_name = db.shorten_name('librairy_picture_tags')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('picture', models.ForeignKey(orm['librairy.picture'], null=False)),
            ('tag', models.ForeignKey(orm['librairy.tag'], null=False))
        ))
        db.create_unique(m2m_table_name, ['picture_id', 'tag_id'])

        # Adding M2M table for field collections on 'Picture'
        m2m_table_name = db.shorten_name('librairy_picture_collections')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('picture', models.ForeignKey(orm['librairy.picture'], null=False)),
            ('collection', models.ForeignKey(orm['librairy.collection'], null=False))
        ))
        db.create_unique(m2m_table_name, ['picture_id', 'collection_id'])

        # Adding model 'Directory'
        db.create_table('librairy_directory', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('parent', self.gf('mptt.fields.TreeForeignKey')(blank=True, null=True, to=orm['librairy.Directory'], related_name='Children')),
            ('lft', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('rght', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('tree_id', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('level', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
        ))
        db.send_create_signal('librairy', ['Directory'])

        # Adding model 'Tag'
        db.create_table('librairy_tag', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, null=True, to=orm['librairy.Tag'])),
            ('lft', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('rght', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('tree_id', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('level', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
        ))
        db.send_create_signal('librairy', ['Tag'])

        # Adding model 'Label'
        db.create_table('librairy_label', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('color', self.gf('django.db.models.fields.CharField')(max_length=30)),
        ))
        db.send_create_signal('librairy', ['Label'])

        # Adding model 'Licence'
        db.create_table('librairy_licence', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True, null=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal('librairy', ['Licence'])

        # Adding model 'Collection'
        db.create_table('librairy_collection', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('ensemble', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, null=True, to=orm['librairy.CollectionsEnsemble'])),
            ('nbr_pict', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
        ))
        db.send_create_signal('librairy', ['Collection'])

        # Adding unique constraint on 'Collection', fields ['name', 'ensemble']
        db.create_unique('librairy_collection', ['name', 'ensemble_id'])

        # Adding model 'CollectionsEnsemble'
        db.create_table('librairy_collectionsensemble', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=150)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, null=True, to=orm['librairy.CollectionsEnsemble'])),
            ('lft', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('rght', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('tree_id', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
            ('level', self.gf('django.db.models.fields.PositiveIntegerField')(db_index=True)),
        ))
        db.send_create_signal('librairy', ['CollectionsEnsemble'])

        # Adding unique constraint on 'CollectionsEnsemble', fields ['name', 'parent']
        db.create_unique('librairy_collectionsensemble', ['name', 'parent_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'CollectionsEnsemble', fields ['name', 'parent']
        db.delete_unique('librairy_collectionsensemble', ['name', 'parent_id'])

        # Removing unique constraint on 'Collection', fields ['name', 'ensemble']
        db.delete_unique('librairy_collection', ['name', 'ensemble_id'])

        # Removing unique constraint on 'Picture', fields ['directory', 'name']
        db.delete_unique('librairy_picture', ['directory_id', 'name'])

        # Deleting model 'Picture'
        db.delete_table('librairy_picture')

        # Removing M2M table for field tags on 'Picture'
        db.delete_table(db.shorten_name('librairy_picture_tags'))

        # Removing M2M table for field collections on 'Picture'
        db.delete_table(db.shorten_name('librairy_picture_collections'))

        # Deleting model 'Directory'
        db.delete_table('librairy_directory')

        # Deleting model 'Tag'
        db.delete_table('librairy_tag')

        # Deleting model 'Label'
        db.delete_table('librairy_label')

        # Deleting model 'Licence'
        db.delete_table('librairy_licence')

        # Deleting model 'Collection'
        db.delete_table('librairy_collection')

        # Deleting model 'CollectionsEnsemble'
        db.delete_table('librairy_collectionsensemble')


    models = {
        'librairy.collection': {
            'Meta': {'unique_together': "(('name', 'ensemble'),)", 'object_name': 'Collection'},
            'ensemble': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.CollectionsEnsemble']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'nbr_pict': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'})
        },
        'librairy.collectionsensemble': {
            'Meta': {'unique_together': "(('name', 'parent'),)", 'object_name': 'CollectionsEnsemble'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.CollectionsEnsemble']"}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'librairy.directory': {
            'Meta': {'object_name': 'Directory'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'parent': ('mptt.fields.TreeForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.Directory']", 'related_name': "'Children'"}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'librairy.label': {
            'Meta': {'object_name': 'Label'},
            'color': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'})
        },
        'librairy.licence': {
            'Meta': {'object_name': 'Licence'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True', 'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'librairy.picture': {
            'Meta': {'unique_together': "(('directory', 'name'),)", 'object_name': 'Picture'},
            'aperture': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True', 'null': 'True'}),
            'camera': ('django.db.models.fields.CharField', [], {'max_length': '140', 'blank': 'True', 'null': 'True'}),
            'collections': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'blank': 'True', 'null': 'True', 'to': "orm['librairy.Collection']"}),
            'color': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'null': 'True'}),
            'date_import': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'auto_now_add': 'True'}),
            'date_origin': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'null': 'True'}),
            'date_update': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'auto_now_add': 'True', 'auto_now': 'True'}),
            'directory': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['librairy.Directory']"}),
            'height': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iso': ('django.db.models.fields.PositiveSmallIntegerField', [], {'blank': 'True', 'null': 'True'}),
            'label': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.Label']"}),
            'legend': ('django.db.models.fields.TextField', [], {'blank': 'True', 'null': 'True'}),
            'lens': ('django.db.models.fields.CharField', [], {'max_length': '140', 'blank': 'True', 'null': 'True'}),
            'licence': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.Licence']"}),
            'md5': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'name_import': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'name_origin': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'nbr_read': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'note': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'size': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'speed': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True', 'null': 'True'}),
            'tags': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'blank': 'True', 'null': 'True', 'to': "orm['librairy.Tag']"}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '140', 'blank': 'True', 'null': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'width': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        'librairy.tag': {
            'Meta': {'object_name': 'Tag'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'null': 'True', 'to': "orm['librairy.Tag']"}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '150'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        }
    }

    complete_apps = ['librairy']