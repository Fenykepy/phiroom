from datetime import datetime

from django.db import models
from django.core.urlresolvers import reverse

from weblog.models import Entry, PublishedManager, NotDraftManager
from librairy.models import Picture, PICTURES_ORDERING_CHOICES

class Portfolio(Entry):
    """Portfolio weblog entry"""
    objects = models.Manager()
    published = PublishedManager()
    not_draft = NotDraftManager()
    pictures = models.ManyToManyField(Picture, through='Portfolio_pictures', null=True, blank=True, verbose_name="Images")
    n_pict = models.PositiveIntegerField(default=0, verbose_name="Nombre d'images")
    order = models.CharField(max_length=150, null=True, blank=True,
            choices=PICTURES_ORDERING_CHOICES, default='name', verbose_name="Ordre")
    reversed_order = models.BooleanField(default=False, verbose_name="Classement décroissant")

    @property
    def get_sorted_pictures(self):
        """Returns Picture objects queryset order by 'self.order'
        and reversed if 'self.reversed_order'"""
        if self.order == 'custom':
            return [portfolio.picture for portfolio in
                    Portfolio_pictures.objects.filter(portfolio=self)
                    .order_by('order')]
        else:
            order = self.order
            if self.reversed_order:
                order = '-' + self.order
            return self.pictures.order_by(order)

    def get_absolute_url(self):
        return reverse('portfolio_view', kwargs={'slug': self.slug})
    
    def save(self, **kwargs):
        """Set entry as portfolio and save"""
        self.is_portfolio = True
        super(Portfolio, self).save()

class Portfolio_pictures(models.Model):
    """Through class for portfolios's pictures relation, add order column"""
    portfolio = models.ForeignKey(Portfolio)
    picture = models.ForeignKey(Picture)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
