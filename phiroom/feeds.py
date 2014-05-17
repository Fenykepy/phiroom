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
        self.conf = Conf.objects.latest('date')
        self.title = self.conf.feed_title
        self.subtitle = self.conf.feed_description

    def items(self):
        return Entry.published_entry.order_by('-pub_date')[:self.conf.feed_number]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.abstract


