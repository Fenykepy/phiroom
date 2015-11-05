# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conf',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('domain', models.CharField(default='phiroom.org', max_length=100, verbose_name='Domain name', help_text="Website's domain name, e.g. phiroom.com,                     or www.phiroom.org.")),
                ('title', models.CharField(default='Phiroom', max_length=254, verbose_name='Title', help_text="Website's main title, will be display in page header.")),
                ('subtitle', models.CharField(max_length=254, null=True, blank=True, default='Le cms des photographes…', verbose_name='Subtitle', help_text="Website's main subtitle, will be display in page header.")),
                ('logo', models.ImageField(upload_to='images/logos/', null=True, blank=True, default='images/default/default_logo.png', verbose_name="Website's logo.", help_text='The logo you can see on each page header.                     Leave blank to use default one.')),
                ('librairy_logo', models.ImageField(upload_to='images/logos/', null=True, blank=True, default='images/default/librairy_default_logo.png', verbose_name="Librairy's logo.", help_text='The logo you can see on librairy page header.                     Leave blank to use default one.')),
                ('n_posts_per_page', models.PositiveSmallIntegerField(default=3, verbose_name='Paginate by', help_text='Maximum number of posts per list page.')),
                ('large_previews_size', models.PositiveIntegerField(default=1024, verbose_name='Size of the biggest public previews', choices=[(0, 'Taille réelle'), (700, '700px pour le grand côté'), (1024, '1024px pour le grand côté'), (2048, '20148px pour le grand côté')], help_text='A preview regeneration is necessary after each                     change of this setting (import folder again with                     "regenerate previews of existing images" option).')),
                ('fb_link', models.URLField(blank=True, null=True, verbose_name='Facebook page link', help_text='Url to a facebook page, will be displayed on                     under a small logo.')),
                ('twitter_link', models.URLField(blank=True, null=True, verbose_name='Twitter page link', help_text='Url to a twitter page, will be displayed on                     under a small logo.')),
                ('gplus_link', models.URLField(blank=True, null=True, verbose_name='Google plus page link', help_text='Url to a google plus page, will be displayed on                     under a small logo.')),
                ('flickr_link', models.URLField(blank=True, null=True, verbose_name='Flickr page link', help_text='Url to a flickr page, will be displayed on                     under a small logo.')),
                ('vk_link', models.URLField(blank=True, null=True, verbose_name='Vkontakte page link', help_text='Url to a vkontakte page, will be displayed on                     under a small logo.')),
                ('registration_mail', models.BooleanField(default=True, verbose_name='Registration mail', help_text='Whether or not admins receive a mail for each                     new registration.')),
                ('comment', models.TextField(default='', verbose_name='Comment', help_text='A short word about changements given to this                     configuration.')),
                ('date', models.DateTimeField(db_index=True, null=True, auto_now=True, verbose_name='Configuration date')),
            ],
            options={
                'get_latest_by': 'date',
            },
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(db_index=True, max_length=100, verbose_name='Name')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('is_in_main_menu', models.BooleanField(db_index=True, verbose_name='Show in main menu', default=False)),
                ('position_in_main_menu', models.PositiveSmallIntegerField(default=100)),
                ('is_active', models.BooleanField(default=True, verbose_name='Activate')),
                ('content', models.TextField(blank=True, null=True, verbose_name='Contenu')),
                ('source', models.TextField(blank=True, null=True, verbose_name='Source')),
                ('state', models.CharField(max_length=254)),
            ],
            options={
                'ordering': ['position_in_main_menu', 'pk'],
            },
        ),
        migrations.AddField(
            model_name='conf',
            name='home_page',
            field=models.ForeignKey(default=1, to='conf.Page', verbose_name='Home page', help_text='Page to use as "home page" (when "/" url                     is given.'),
        ),
    ]
