# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_auto_20151204_1245'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='portfoliopicture',
            unique_together=set([('portfolio', 'picture')]),
        ),
    ]
