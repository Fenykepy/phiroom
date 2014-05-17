from django.db import models
from weblog.models import Entry

class Task(models.Model):
    """Tasks table."""
    date = models.DateTimeField(auto_now_add=True, auto_now=True)
    date_run_task = models.DateTimeField(auto_now_add=False, auto_now=False)
    entry = models.OneToOneField(Entry)

    def __str__(self):
        return "Tâche de l'entrée {0}".format(self.entry.slug)

