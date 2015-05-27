# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conf',
            name='logo',
        ),
        migrations.AddField(
            model_name='conf',
            name='weblog_logo',
            field=models.ImageField(default='images/default/default_logo.png', blank=True, help_text="The logo you can see on each weblog's page header.                     Leave blank to use default one.", null=True, upload_to='images/logos/', verbose_name="Weblog's logo."),
        ),
    ]
