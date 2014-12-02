#-*- coding: utf-8 -*-

from django.contrib import admin
from librairy.models import Picture, Directory, Tag, Label, Licence, Collection, CollectionsEnsemble

admin.site.register(Picture)
admin.site.register(Directory)
admin.site.register(Tag)
admin.site.register(Label)
admin.site.register(Licence)
admin.site.register(Collection)
admin.site.register(CollectionsEnsemble)
