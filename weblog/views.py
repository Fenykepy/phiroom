from django.views.generic import ListView, DetailView

import phiroom.settings as settings

from weblog.models import Post


class ListPosts(ListView):
    """List all weblog posts by pub_date."""
    model = Post
    context_object_name = 'posts'
    template_name = 'weblog/weblog_list.html'
    paginate_by = settings.WEBLOG_POSTS_PAGINATION

    def get_queryset(self):
        return Post.published.all()



class ListPostsByTag(ListPosts):
    """List all weblog posts of a given tag."""

    def get_queryset(self):
        return Post.published.filter(
                tag__slug = self.kwargs['slug']
            )



class ViewPost(DetailView):
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
