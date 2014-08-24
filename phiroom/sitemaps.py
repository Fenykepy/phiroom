#-*- coding: utf-8 -*-

from django.contrib.sitemaps import Sitemap
from django.core.urlresolvers import reverse
from weblog.models import Entry, Tag

class WeblogSitemap(Sitemap):
    """Site map of weblog entrys."""
    changefreq = 'daily'
    priority = 1

    def items(self):
        return Entry.published.all()
        
    def lastmod(self, item):
        return item.pub_update


class TagSitemap(Sitemap):
    """Site map of weblog entrys by tag."""
    changefreq = 'daily'
    priority = 0.1

    def items(self):
        return Tag.objects.filter(n_entry__gt=0)


class StaticSitemap(Sitemap):
    """Site map of static pages."""
    changefreq = 'daily'
    priority = 0.5
    
    def items(self):
        return [
                'home',
                'weblog_home',
                'weblog_portfolios',
                'portfolio_home',
                'contact_home',
                'user_login',
                'user_registration',
        ]

    def location(self, item):
        return reverse(item)


