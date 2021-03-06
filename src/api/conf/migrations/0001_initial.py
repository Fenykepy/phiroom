# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-07-02 14:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conf',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Phiroom', help_text="Website's main title, will be display in page header.", max_length=254, verbose_name='Title')),
                ('subtitle', models.CharField(blank=True, default='Le cms des photographes…', help_text="Website's main subtitle, will be display in page header.", max_length=254, null=True, verbose_name='Subtitle')),
                ('weblog_logo', models.ImageField(blank=True, default='images/default/default_logo.svg', help_text="The logo you can see on each weblog's page header.                     Leave blank to use default one.", null=True, upload_to='images/logos/', verbose_name="Weblog's logo.")),
                ('librairy_logo', models.ImageField(blank=True, default='images/default/librairy_default_logo.svg', help_text='The logo you can see on librairy page header.                     Idealy 50px height.                     Leave blank to use default one.', null=True, upload_to='images/logos/', verbose_name="Librairy's logo.")),
                ('n_posts_per_page', models.PositiveSmallIntegerField(default=3, help_text='Maximum number of posts per list page.', verbose_name='Paginate by')),
                ('abstract_delimiter', models.CharField(default='[...]', help_text='Characters sequence used to separate abstract part of a                     weblog post.', max_length=254, verbose_name='Abstract delimiter')),
                ('abstract_last_char', models.CharField(default='…', help_text='Characters sequence added at the end of each abstract, in                     replacement of the abstract delimiter.', max_length=254, verbose_name='Abstract last character')),
                ('abstract_replaced_chars', models.CharField(default=',.!?…', help_text='List of characters that will be replaced by abstract last                     character if they end abstract.', max_length=254, verbose_name='Abstract replaced characters')),
                ('carousel_default_height', models.PositiveIntegerField(default=600, verbose_name='Max height of carousels.')),
                ('slideshow_duration', models.PositiveIntegerField(default=3000, help_text="Duration between 2\xa0slides in portfolio's                     carousel, in milliseconds.", verbose_name='Carousel slideshow duration')),
                ('large_previews_size', models.PositiveIntegerField(choices=[(0, 'Taille réelle'), (700, '700px pour le grand côté'), (1024, '1024px pour le grand côté'), (2048, '20148px pour le grand côté')], default=1024, help_text='A preview regeneration is necessary after each                     change of this setting (import folder again with                     "regenerate previews of existing images" option).', verbose_name='Size of the biggest public previews')),
                ('fb_link', models.URLField(blank=True, help_text='Url to a facebook page, will be displayed on                     under a small logo.', null=True, verbose_name='Facebook page link')),
                ('twitter_link', models.URLField(blank=True, help_text='Url to a twitter page, will be displayed on                     under a small logo.', null=True, verbose_name='Twitter page link')),
                ('gplus_link', models.URLField(blank=True, help_text='Url to a google plus page, will be displayed on                     under a small logo.', null=True, verbose_name='Google plus page link')),
                ('flickr_link', models.URLField(blank=True, help_text='Url to a flickr page, will be displayed on                     under a small logo.', null=True, verbose_name='Flickr page link')),
                ('vk_link', models.URLField(blank=True, help_text='Url to a vkontakte page, will be displayed on                     under a small logo.', null=True, verbose_name='Vkontakte page link')),
                ('pinterest_link', models.URLField(blank=True, help_text='Url to a pinterest page, will be displayed on                     under a small logo.', null=True, verbose_name='Pinterest page link')),
                ('px500_link', models.URLField(blank=True, help_text='Url to a 500px page, will be displayed on                     under a small logo.', null=True, verbose_name='500px page link')),
                ('insta_link', models.URLField(blank=True, help_text='Url to a instagram page, will be displayed on                     under a small logo.', null=True, verbose_name='Instagram page link')),
                ('registration_mail', models.BooleanField(default=True, help_text='Whether or not admins receive a mail for each                     new registration.', verbose_name='Registration mail')),
                ('comment', models.TextField(default='', help_text='A short word about changements given to this                     configuration.', verbose_name='Comment')),
                ('date', models.DateTimeField(auto_now=True, db_index=True, null=True, verbose_name='Configuration date')),
            ],
            options={
                'get_latest_by': 'date',
            },
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=100, verbose_name='Name')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('is_in_main_menu', models.BooleanField(db_index=True, default=False, verbose_name='Show in main menu')),
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
    ]
