from django.contrib import admin
from conf.models import Conf, Page

class ConfAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.pk = None
        obj.save()

admin.site.register(Conf, ConfAdmin)
admin.site.register(Page)
