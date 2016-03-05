from django.core.management.base import BaseCommand, CommandError

from librairy.models import recursive_import

class Command(BaseCommand):
    
    help = "Import given picture's path to librairy, \
            if a directory path is given, recursively import \
            all found pictures inside it."

    def add_arguments(self, parser):
        parser.add_argument('path', nargs='+',
                help="pathname to a folder or a picture file.")

    def handle(self, *args, **options):
        for file in options['path']:
            recursive_import(file)
