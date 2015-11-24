from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from portfolio.serializers import *
from portfolio.models import Portfolio
from librairy.serializers import PictureShortSerializer
from librairy.models import Picture

from phiroom.permissions import IsStaffOrReadOnly, IsAuthorOrReadOnly

@api_view(('GET',))
def portfolio_root(request, format=None):
    return Response({
        'headers': reverse('portfolios-headers', request=request, format=format), 
        'list': reverse('portfolios-list', request=request, format=format), 
    })


class PortfolioList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of portfolios and allows new
    portfolios to be created.
    """
    queryset = Portfolio.published.all()
    serializer_class = PortfolioSerializer
    permission_classes = (IsStaffOrReadOnly,)
    lookup_field = 'slug'

    # allow staff members to list not published portfolios
    def get_queryset(self):
        if self.request.user.is_staff:
            return Portfolio.objects.all()
        return Portfolio.published.all()
    
    # automatically add author on save
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)




class PortfolioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific portfolio and allows to
    update or delete it.
    """
    queryset = Portfolio.published.all()
    serializer_class = PortfolioSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    lookup_field = 'slug'

    # allow staff members to retriev not published portfolios.
    # prefetch author to avoid one more sql request when querying permissions
    def get_queryset(self):
        if self.request.user.is_staff:
            return Portfolio.objects.all().select_related('author')
        return Portfolio.published.all().select_related('author')



@api_view(['GET'])
def portfolios_headers_list(request, format=None):
    """
    Returns a list of portfolios headers (slug, title) without pagination.
    All portfolios are returned if user is admin.
    Only published ones else.
    """
    if request.user.is_staff:
        portfolios = Portfolio.objects.all()
    else:
        portfolios = Portfolio.published.all()
    portfolios = portfolios.only('slug', 'title')
    serializer = PortfolioHeadSerializer(portfolios, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def portfolio_pictures(request, slug, format=None):
    """
    Returns a list of all pictures short data (public) of a portfolio
    without pagination.
    """
    pictures = Portfolio.objects.get(slug=slug).pictures.all()
    pictures = pictures.only('pk', 'sha1', 'title', 'legend',
            'previews_path', 'ratio')
    serializer = PictureShortSerializer(pictures, many=True)

    return Response(serializer.data)
    
    
