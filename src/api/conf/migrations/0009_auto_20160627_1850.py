# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def conf_default(apps, schema_editor):
    Conf = apps.get_model("conf", "Conf")

    # create default configuration
    conf = Conf.objects.get(pk=1)
    conf.weblog_logo = 'images/default/default_logo.svg' 
    conf.librairy_logo = 'images/default/librairy_default_logo.svg'
    conf.save()



class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0008_auto_20160323_0657'),
    ]

    operations = [
        migrations.RunPython(conf_default),
    ]
