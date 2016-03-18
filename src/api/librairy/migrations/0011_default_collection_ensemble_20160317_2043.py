# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations



def librairy_default_collection_ensemble(apps, schema_editor):
    # create a default root collection ensemble
    Ensemble = apps.get_model("librairy", "CollectionsEnsemble")

    e = Ensemble()
    e.name = "root ensemble"
    e.lft=0
    e.level=0
    e.rght=0
    e.tree_id=0
    e.save()



class Migration(migrations.Migration):

    dependencies = [
        ('librairy', '0010_auto_20160216_1245'),
    ]

    operations = [
        migrations.RunPython(librairy_default_collection_ensemble),
    ]
