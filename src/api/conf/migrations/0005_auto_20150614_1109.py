# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations



def weblog_state(apps, schema_editor):
    Page = apps.get_model("conf", "Page")

    p = Page.objects.get(pk=2)
    p.state = "weblog.list"
    p.save()



class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0004_auto_20150613_2020'),
    ]

    operations = [
        migrations.RunPython(weblog_state),
    ]
