from datetime import datetime
from django.utils import timezone

from django.core.management.base import BaseCommad, CommandError

from tasks.models import Task


class Command(BaseCommand):
    help = 'Run publishing tasks for candidate entrys of Task table'

    def handle(self, *args, **options):
        # get tasks queryset
        tasks = Task.objects.filter(date_run_task__lte = timezone.now).order_by('date_run_task')
        
        for task in tasks:
            if not task.entry:
                task.delete()
            else:
                # reset entry corresponding cache
                task.entry.clear_cache()
                # send email to suscribers
                task.entry.mail_followers()
                # delete task
                task.delete()





