from django.contrib import admin
from weblog.models import Post, Tag



class PostAdmin(admin.ModelAdmin):
    fields = ('title', 'description', 'source', 'tags', 'draft', 'pub_date')
    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()

admin.site.register(Post, PostAdmin)



class TagAdmin(admin.ModelAdmin):
    fields = ('name',)

admin.site.register(Tag, TagAdmin)

