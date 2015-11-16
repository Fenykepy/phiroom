from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from portfolio.serializers import *
from portfolio.models import Portfolio

from phiroom.permissions import IsStaffOrReadOnly, IsAuthorOrReadOnly


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
            return Portfolio.objects.all().select_related('author')
        return Portfolio.published.all().select_related('author')
    
    # automatically add author on save
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)




class PortfolioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific portfolio and allows to
    update or delete it.
    """
    queryset = Portfolio.published.all().select_related('author')
    serializer_class = PortfolioSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    lookup_field = 'slug'

    # allow staff members to retriev not published portfolios.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Portfolio.objects.all().select_related('author')
        return Portfolio.published.all().select_related('author')


@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdminUser, ))
def portfolio_head_list(request, format=None):
    """
    Returns a list of all user's portfolios headers (slug, pk, title)
    without pagination.
    """
    portfolios = Portfolio.objects.filter(author=request.user)
    serializer = PortfolioHeadSerializer(portfolios, many=True)

    return Response(serializer.data)

