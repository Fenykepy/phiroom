# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(verbose_name='last login', default=django.utils.timezone.now)),
                ('is_superuser', models.BooleanField(verbose_name='superuser status', default=False, help_text='Designates that this user has all permissions without explicitly assigning them.')),
                ('username', models.CharField(max_length=30, verbose_name='username', validators=[django.core.validators.RegexValidator('^[\\w.@+-]+$', 'Enter a valid username.', 'invalid')], unique=True, help_text='Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.')),
                ('first_name', models.CharField(max_length=30, verbose_name='first name', blank=True)),
                ('last_name', models.CharField(max_length=30, verbose_name='last name', blank=True)),
                ('email', models.EmailField(max_length=75, verbose_name='email address', blank=True)),
                ('is_staff', models.BooleanField(verbose_name='staff status', default=False, help_text='Designates whether the user can log into this admin site.')),
                ('is_active', models.BooleanField(verbose_name='active', default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.')),
                ('date_joined', models.DateTimeField(verbose_name='date joined', default=django.utils.timezone.now)),
                ('uuid', models.CharField(null=True, max_length=42, blank=True)),
                ('uuid_expiration', models.DateTimeField(null=True, blank=True)),
                ('avatar', models.ImageField(null=True, upload_to='images/avatars', verbose_name='Avatar', help_text='A picture to download as avatar.', blank=True)),
                ('author_name', models.CharField(null=True, max_length=100, verbose_name='Author name', help_text='Your name as shown under content you published', blank=True)),
                ('website', models.URLField(null=True, max_length=2000, verbose_name='Website', help_text='A link to your website', blank=True)),
                ('facebook_link', models.URLField(null=True, max_length=2000, verbose_name='Facebook', help_text='A link to your facebook page', blank=True)),
                ('flickr_link', models.URLField(null=True, max_length=2000, verbose_name='Flickr', help_text='A link to your flickr page', blank=True)),
                ('px500_link', models.URLField(null=True, max_length=2000, verbose_name='500px', help_text='A link to your 500px page', blank=True)),
                ('twitter_link', models.URLField(null=True, max_length=2000, verbose_name='Twitter', help_text='A link to your twitter page', blank=True)),
                ('gplus_link', models.URLField(null=True, max_length=2000, verbose_name='Google +', help_text='A link to your google + page', blank=True)),
                ('pinterest_link', models.URLField(null=True, max_length=2000, verbose_name='Pinterest', help_text='A link to your pinterest page', blank=True)),
                ('vk_link', models.URLField(null=True, max_length=2000, verbose_name='Vkontakte', help_text='A link to your vkontakte page', blank=True)),
                ('mail_newsletter', models.BooleanField(verbose_name='Suscribe to news letter', default=False, help_text='To receive a mail at each new publication.')),
                ('mail_contact', models.BooleanField(verbose_name='Receive contact emails', db_index=True, help_text='To receive mails sent from contact page.(for staff members only)', default=False)),
                ('mail_registration', models.BooleanField(verbose_name="Receive registration's emails", db_index=True, help_text='To receive a mail at each new registration.(for staff members only)', default=False)),
                ('groups', models.ManyToManyField(related_query_name='user', help_text='The groups this user belongs to. A user will get all permissions granted to each of his/her group.', to='auth.Group', blank=True, related_name='user_set', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', help_text='Specific permissions for this user.', to='auth.Permission', blank=True, related_name='user_set', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
            bases=(models.Model,),
        ),
    ]
