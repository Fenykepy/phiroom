from django.contrib import admin
from weblog.models import Entry, Category, Tag

admin.site.register(Entry)
admin.site.register(Category)
admin.site.register(Tag)
