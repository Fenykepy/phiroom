# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Conf'
        db.create_table('conf_conf', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('domain', self.gf('django.db.models.fields.CharField')(max_length=100, default='phiroom.org')),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100, default='Phiroom')),
            ('title_home', self.gf('django.db.models.fields.CharField')(max_length=100, default='Phiroom')),
            ('sub_title_home', self.gf('django.db.models.fields.CharField')(max_length=100, default='le cms des photographes…')),
            ('site_logo', self.gf('django.db.models.fields.CharField')(max_length=100, default='/assets/images/structure/phiroom.png')),
            ('home_logo', self.gf('django.db.models.fields.CharField')(max_length=100, default='/assets/images/structure/phiroom-home.png')),
            ('home_page', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['conf.Page'])),
            ('mail_profil', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('mail_inscription', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('mail_comment', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('nbr_articles_per_page', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=5)),
            ('share_twitter', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('share_gplus', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('share_gplus_public', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('share_fb', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('share_vk', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('follow_twitter', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('twitter_link', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200, default='')),
            ('follow_gplus', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('gplus_link', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200, default='')),
            ('follow_fb', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('fb_link', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200, default='')),
            ('follow_vk', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('vk_link', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200, default='')),
            ('follow_rss', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('rss_link', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200, default='')),
            ('no_fb', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('nbr_last_articles_menu', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=10)),
            ('nbr_last_galleries_menu', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=10)),
            ('nbr_last_pictofdays_menu', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=10)),
            ('print_comment', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('nbr_rev_conf', self.gf('django.db.models.fields.BigIntegerField')(default=5)),
            ('comment', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('conf', ['Conf'])

        # Adding model 'Page'
        db.create_table('conf_page', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('is_in_main_menu', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('position_in_main_menu', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=100)),
            ('is_in_home_menu', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('position_in_home_menu', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=100)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('content', self.gf('django.db.models.fields.TextField')(null=True)),
            ('source', self.gf('django.db.models.fields.TextField')(null=True)),
            ('reverse_url', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('conf', ['Page'])


    def backwards(self, orm):
        # Deleting model 'Conf'
        db.delete_table('conf_conf')

        # Deleting model 'Page'
        db.delete_table('conf_page')


    models = {
        'conf.conf': {
            'Meta': {'object_name': 'Conf'},
            'comment': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'phiroom.org'"}),
            'fb_link': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200', 'default': "''"}),
            'follow_fb': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'follow_gplus': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'follow_rss': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'follow_twitter': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'follow_vk': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gplus_link': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200', 'default': "''"}),
            'home_logo': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'/assets/images/structure/phiroom-home.png'"}),
            'home_page': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['conf.Page']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail_comment': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'mail_inscription': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'mail_profil': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'nbr_articles_per_page': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '5'}),
            'nbr_last_articles_menu': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '10'}),
            'nbr_last_galleries_menu': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '10'}),
            'nbr_last_pictofdays_menu': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '10'}),
            'nbr_rev_conf': ('django.db.models.fields.BigIntegerField', [], {'default': '5'}),
            'no_fb': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'print_comment': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'rss_link': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200', 'default': "''"}),
            'share_fb': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'share_gplus': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'share_gplus_public': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'share_twitter': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'share_vk': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'site_logo': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'/assets/images/structure/phiroom.png'"}),
            'sub_title_home': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'le cms des photographes…'"}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'Phiroom'"}),
            'title_home': ('django.db.models.fields.CharField', [], {'max_length': '100', 'default': "'Phiroom'"}),
            'twitter_link': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200', 'default': "''"}),
            'vk_link': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200', 'default': "''"})
        },
        'conf.page': {
            'Meta': {'object_name': 'Page'},
            'content': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_in_home_menu': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_in_main_menu': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'position_in_home_menu': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '100'}),
            'position_in_main_menu': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '100'}),
            'reverse_url': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'source': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['conf']