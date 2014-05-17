from stats.models import Page, View
from weblog.models import Entry

class StatsMiddleware(object):
    """for each request save url, ip, date, user and get a number of views."""
    def process_view(self, request, view_func, view_args, view_kwargs):
        # increment url number of view, create if necessary
        if request.path[:8] != '/assets/' or request.path[:7] != '/media/':
            try:
                page = Page.objects.get(url=request.path)
            except Page.DoesNotExist:
                # set a list of url names where entrys view number should be count
                url_names = {'pictofday_view', 'gallery_view', 'portfolio_view', 'article_view'}
                if request.resolver_match.url_name in url_names:
                    if 'slug' in view_kwargs:
                        entry = Entry.objects_entry.get(slug=view_kwargs['slug'])
                    else:
                        date = view_kwargs['date'].replace("/", "-", 2)
                        entry = Entry.objects_entry.get(pictofday__day_date=date)
                    page = Page(url=request.path, entry=entry)
                else:
                    page = Page(url=request.path)

            page.n_view += 1
            if not request.user.is_staff:
                page.n_view_not_staff += 1
            page.save()
            # log over info in db
            if not request.user.is_authenticated():
                View(page=page, ip=request.META.get('REMOTE_ADDR')).save()
            else:
                View(page=page, ip=request.META.get('REMOTE_ADDR'), user=request.user).save()

