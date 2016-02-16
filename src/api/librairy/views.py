from django.http import Http404, HttpResponseForbidden

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

from phiroom.permissions import IsStaffOrReadOnly

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        Label, Picture


class PicturesList(generics.ListCreateAPIView):
    """
    This view presents a list of all pictures and allows new pictures
    to be created.
    """

    queryset = Picture.objects.all()
    permission_classes = (IsAdminUser,)

    def get_serializer_class(self):
        """
        Overide method to return PictureUploadSerializer if method is POST 
        or PictureSerializer if method is GET.
        """
        if self.request.method == 'POST':
            return PictureUploadSerializer
        return PictureSerializer


class PictureDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view presents a specific picture and allows to update or delete it.
    """

    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    permission_classes = (IsAdminUser,)


class PictureShortDetail(generics.RetrieveAPIView):
    """
    This view presents a specific picture's public datas.
    """

    queryset = Picture.objects.all()
    serializer_class = PictureShortSerializer
    permission_classes = (IsStaffOrReadOnly,)


@api_view(['GET'])
@permission_classes((IsAdminUser,))
def PicturesPkList(request, format=None):
    """
    Returns a flat list of all pictures pks
    ordered by importation date without pagination
    """
    pks = Picture.objects.values_list('pk', flat=True).order_by('-importation_date')

    return Response(pks)
