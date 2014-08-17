#-*- coding: utf-8 -*-

from django.contrib.sitemaps import Sitemap
from django.core.urlresolvers import reverse
from weblog.models import Entry, Tag

class WeblogSitemap(Sitemap):
    """Site map of weblog entrys."""
    changefreq = 'monthly'
    priority = 1

    def items(self):
        return Entry.published_entry.all()
        
    def lastmod(self, item):
        return item.pub_update


class TagSitemap(Sitemap):
    """Site map of weblog entrys by tag."""
    changefreq = 'daily'
    priority = 0.1

    def items(self):
        return Tag.objects.all()


class StaticSitemap(Sitemap):
    """Site map of static pages."""
    changefreq = 'daily'
    priority = 0.5
    
    def items(self):
        return ['home', 'pictofday_home' ,'portfolio_home', 'user_login', 'user_suscription',
                'weblog_home', 'weblog_articles', 'weblog_gallerys', 'weblog_portfolios',
                'weblog_pictofdays']

    def location(self, item):
        return reverse(item)


