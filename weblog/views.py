from django.conf import settings
from django.views.generic import ListView, DetailView
from django.views.generic.base import ContextMixin
from django.contrib.auth.models import User

from rest_framework import viewsets, generics
from weblog.serializers import PostSerializer, TagSerializer, UserSerializer

from weblog.models import Post, Tag
from conf.models import Conf, Page


class ConfMixin(ContextMixin):
    """Mixin to get site configuration in context."""
    page_name = 'weblog'

    def __init__(self, *args, **kwargs):
        super(ConfMixin, self).__init__(*args, **kwargs)
        self.conf = Conf.objects.select_related().latest()

    def get_context_data(self, **kwargs):
        context = super(ConfMixin, self).get_context_data(**kwargs)
        context['conf'] = self.conf
        context['page_info'] = Page.info.get(
                name=self.page_name)
        context['menu'] = Page.main_menu.all()
        context['phiroom'] = settings.PHIROOM

        return context



class ListPosts(ListView, ConfMixin):
    """List all weblog posts by pub_date."""
    model = Post
    context_object_name = 'posts'
    template_name = 'weblog/weblog_list.html'

    def get_paginate_by(self, queryset):
        """Get the number of items to paginate by,
        or None for no pagination."""
        return self.conf.n_posts_per_page

    def get_queryset(self):
        return Post.published.all()



class ListPostsByTag(ListPosts):
    """List all weblog posts of a given tag."""

    def get_queryset(self):
        return Post.published.filter(
                tags__slug = self.kwargs['slug']
            )



class ViewPost(DetailView, ConfMixin):
    """Detail view for a specific weblog post."""
    model = Post
    context_object_name = 'post'
    template_name = 'weblog/weblog_view.html'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.filter(
                    slug=self.kwargs['slug'],
                )
        else:
            return Post.published.filter(
                    slug=self.kwargs['slug'],
                )

    def get_context_data(self, **kwargs):
        context = super(ViewPost, self).get_context_data(**kwargs)
        context['prev'] = self.object.prev_post_url()
        context['next'] = self.object.next_post_url()

        return context



class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.published.all()
    serializer_class = PostSerializer



class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
 


class PostsListByTag(generics.ListAPIView):
    """
    API endpoint that allows to list posts by tags.
    """
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.published.filter(tags__slug=self.kwargs['slug'])




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
