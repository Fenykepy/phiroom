from django.db import models, migrations


def description_default(apps, schema_editor):
    Description = apps.get_model("contact", "Description")

    # create default configuration
    desc = Description()
    desc.title = "Contact"
    desc.source = "Change to your own contact page description"
    desc.content = "<p>Change to your own contact page description</p>"
    desc.save()


class Migration(migrations.Migration):
    
    dependencies = [
        ('contact', '0002_auto_20151204_1248'),
    ]

    operations = [
        migrations.RunPython(description_default),
    ]
