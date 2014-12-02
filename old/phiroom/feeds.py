from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Atom1Feed
from django.core.urlresolvers import reverse_lazy

from conf.models import Conf
from weblog.models import Entry

class WeblogFeed(Feed):
    """Class to return the 50 last weblog entrys (default feed)."""
    link = reverse_lazy("weblog_home")
    feed_type = Atom1Feed

    def __init__(self, *args, **kwargs):
        super(WeblogFeed, self).__init__(*args, **kwargs)
        self.conf = Conf.objects.values(
                'feed_title',
                'feed_description',
                'feed_number'
            ).latest()
        self.title = self.conf['feed_title']
        self.subtitle = self.conf['feed_description']

    def items(self):
        return Entry.published.all()[:self.conf['feed_number']]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.abstract


