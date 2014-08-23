from stats.models import View
from phiroom.settings import MEDIA_URL, STATIC_URL

class StatsMiddleware(object):
    """for each request log url, ip, date, user."""
    media_len = len(MEDIA_URL)
    static_len = len(STATIC_URL)

    def process_view(self, request, view_func, view_args, view_kwargs):


        # don't log access to media and assets (server does it better)
        if (request.path[:self.media_len] != MEDIA_URL or
            request.path[:self.static_len] != STATIC_URL):
            
            # add an entry in the logs
            view = View(url=request.path, ip=request.META.get('REMOTE_ADDR'))

            if request.user.is_authenticated():
                view.user = request.user

            if request.user.is_staff:
                view.staff = True

            view.save()

