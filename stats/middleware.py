from stats.models import View
from weblog.models import Entry
from django.shortcuts import get_object_or_404

class StatsMiddleware(object):
    """for each request log url, ip, date, user."""
    def process_view(self, request, view_func, view_args, view_kwargs):


        # don't log access to media and assets (server does it better)
        if request.path[:8] != '/assets/' or request.path[:7] != '/media/':
            
            # add an entry in the logs
            view = View(url=request.path, ip=request.META.get('REMOTE_ADDR'))

            if request.user.is_authenticated():
                authenticated = True
                view.user = request.user

            if request.user.is_staff:
                view.staff = True

            view.save()


            # set a list of url names where entrys view number should be count
            # add 'pictofday_view' to the set when pictofday will be "picture on the top" with slug
            url_names = {'gallery_view', 'portfolio_view', 'article_view'}
            if request.resolver_match.url_name in url_names:
                if 'slug' in view_kwargs:
                    entry = get_object_or_404(Entry, slug=view_kwargs['slug'])
                    entry.n_view += 1
                    
                    if not request.user.is_staff:
                        entry.n_view_not_staff += 1

                    entry.n_view_unique = View.objects.filter(url=request.path, staff=False).values('ip').distinct().count()
                    print(entry.n_view_unique)

                    entry.save()




