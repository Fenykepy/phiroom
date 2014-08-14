import pprint

from django.views.generic import ListView
from django.views.generic.base import ContextMixin
from django.shortcuts import get_object_or_404
from django.db.models import Q

from phiroom.settings import PHIROOM
from weblog.models import Entry, Category, Tag
from article.models import Article
from gallery.models import Gallery
from pictofday.models import Pictofday
from portfolio.models import Portfolio
from conf.models import Conf, Page

from user.forms import LoginForm

def user_is_staff(user):
    """Return True if given user is staff member."""
    return user.is_staff


class ConfMixin(ContextMixin):
    """Mixin to get common context for whole website"""
    page_name = 'weblog'

    def __init__(self, *args, **kwargs):
        super(ConfMixin, self).__init__(*args, **kwargs)
        self.conf = Conf.objects.latest('date')

    def get_context_data(self, **kwargs):
        context = super(ConfMixin, self).get_context_data(**kwargs)
        context['conf'] = self.conf
        context['page_info'] = Page.objects.get(name = self.page_name)
        context['menu'] = Page.objects.filter(is_in_main_menu=True).order_by('position_in_main_menu', 'pk')
        context['phiroom'] = PHIROOM

        return context

class WeblogMixin(ConfMixin):
    """Mixin to get generic context fol weblog pages"""
    page_name = 'weblog'

    def get_context_data(self, **kwargs):
        context = super(WeblogMixin, self).get_context_data(**kwargs)
        context['pictofdays_menu'] = Pictofday.published.all()[:self.conf.n_last_pictofdays_menu]
        context['articles_menu'] = Article.published.all()[:self.conf.n_last_articles_menu]
        context['gallerys_menu'] = Gallery.published.all()[:self.conf.n_last_gallerys_menu]
        context['portfolios_menu'] = Portfolio.published.all()[:self.conf.n_last_portfolios_menu]
        context['categorys'] = Category.objects.all()
        context['tags'] = Tag.objects.all()
        context['login_form'] = LoginForm()
        if 'page' in self.kwargs:
            page = int(self.kwargs['page'])
            context['slice'] = "{0}:{1}".format(page - 4, page + 3)

        return context


class ListEntrys(ListView, WeblogMixin):
    """List all weblog entrys by pub_update."""
    model = Entry
    context_object_name = 'entrys'
    template_name = 'weblog/weblog_list.html'

    def get_paginate_by(self, queryset):
        """Get the number of items to paginate by, or ``None`` for no pagination."""
        return self.conf.n_entrys_per_page

    def get_queryset(self):
        return Entry.published_entry.all()

class ListArticles(ListEntrys):
    """List all weblog articles by pub_update."""
    model = Article
    def get_queryset(self):
        return Article.published.all()

class ListGallerys(ListEntrys):
    """List all weblog gallerys by pub_update."""
    model = Gallery
    def get_queryset(self):
        return Gallery.published.all()

class ListPortfolios(ListEntrys):
    """List all weblog portfolios by pub_update."""
    model = Portfolio
    def get_queryset(self):
        return Portfolio.published.all()

class ListPictofdays(ListEntrys):
    """List all weblog pictofdays by pub_update."""
    model = Pictofday
    def get_queryset(self):
        return Pictofday.published.all()

class ListEntrysByCat(ListEntrys):
    """List all weblog entrys corresponding to given category."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByCat, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']
        context['arg1'] = self.kwargs['cat']

        return context

    def get_queryset(self):
        # if category doesn't exists raise 404
        cat = get_object_or_404(Category, slug=self.kwargs['cat'], id=self.kwargs['pk'])

        # test if category is leaf_node, return query
        if cat.is_leaf_node():
            return Entry.published_entry.filter(category = cat)
        # if not search for descendants
        # select descendants categorys
        cat_descendants = cat.get_descendants(include_self=True)
        # set Q objects list with descendants
        queries = [Q(category__id=item.id) for item in cat_descendants]
        # take last Q object from the list
        query = queries.pop()
        # paste Q objects with |
        for item in queries:
            query |= item
        # return queryset
        return Entry.published_entry.filter(query)


class ListEntrysByTag(ListEntrys):
    """List all weblog entrys corresponding to given tag."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByTag, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['slug']

        return context

    def get_queryset(self):
        return Entry.published_entry.filter(tags__slug = self.kwargs['slug'])

class ListEntrysByPicture(ListEntrys):
    """List all weblog entrys corresponding to given picture."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByPicture, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']

        return context

    def get_queryset(self):
        query = Q(gallery__pictures__id = self.kwargs['pk'])|Q(portfolio__pictures__id = self.kwargs['pk'])|Q(pictofday__picture__id = self.kwargs['pk'])
        return Entry.published_entry.filter(query)

class ListEntrysByGallerysPicture(ListEntrys):
    """List all gallerys corresponding to given picture."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByGallerysPicture, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']

        return context

    def get_queryset(self):
        return Entry.published_entry.filter(gallery__pictures__id = self.kwargs['pk'])


class ListEntrysByPortfoliosPicture(ListEntrys):
    """List all portfolios corresponding to given picture."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByPortfoliosPicture, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']

        return context

    def get_queryset(self):
        return Entry.published_entry.filter(portfolio__pictures__id = self.kwargs['pk'])



class ListEntrysByYear(ListEntrys):
    """List all weblog entrys by years."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByYear, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['year']

        return context

    def get_queryset(self):
        return Entry.published_entry.filter(pub_date__year = self.kwargs['year'])


