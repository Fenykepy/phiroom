from stats.models import View

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

