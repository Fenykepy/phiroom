# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def conf_default(apps, schema_editor):
    Conf = apps.get_model("conf", "Conf")

    # create default configuration
    conf = Conf()
    conf.comment = "Paramètres par défaut"
    conf.save()


def pages_default(apps, schema_editor):
    Page = apps.get_model("conf", "Page")

    # create portfolios page data
    p1 = Page()
    p1.pk = 1
    p1.name = "portfolios"
    p1.title = "Portfolios"
    p1.is_in_main_menu = True
    p1.position_in_main_menu = 1
    p1.state = "portfolios"
    p1.save()

    p2 = Page()
    p2.pk = 2
    p2.name = "weblog"
    p2.title = "Weblog"
    p2.is_in_main_menu = True
    p1.position_in_main_menu = 2
    p2.state = "weblog"
    p2.save()

    p3 = Page()
    p3.pk = 3
    p3.name = "contact"
    p3.title = "Contact"
    p3.is_in_main_menu = True
    p1.position_in_main_menu = 3
    p3.state = "portfolios"
    p3.save()

    p3 = Page()
    p3.pk = 4
    p3.name = "librairy"
    p3.title = "Librairy"
    p3.is_in_main_menu = False
    p1.position_in_main_menu = 0
    p3.state = "librairy"
    p3.save()


class Migration(migrations.Migration):

    dependencies = [
        ('conf', '0003_auto_20150608_2053'),
    ]

    operations = [
        migrations.RunPython(conf_default),
        migrations.RunPython(pages_default),
    ]
