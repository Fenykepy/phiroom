from django.http import Http404, HttpResponseForbidden, HttpResponse, FileResponse

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

from phiroom.permissions import IsStaffOrReadOnly

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        CollectionPicture, Label, Picture

from stats.models import Hit


class PicturesList(generics.ListCreateAPIView):
    """
    This view presents a list of all pictures and allows new pictures
    to be created.
    """

    queryset = Picture.objects.all()
    permission_classes = (IsAdminUser,)
    lookup_field = 'sha1'

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
    lookup_field = 'sha1'



class PictureShortDetail(generics.RetrieveAPIView):
    """
    This view presents a specific picture's public datas.
    """

    queryset = Picture.objects.all()
    serializer_class = PictureShortSerializer
    permission_classes = (IsStaffOrReadOnly,)
    lookup_field = 'sha1'


class CollectionEnsembleList(generics.ListCreateAPIView):
    """
    This view presents a list a all collections ensembles and allows
    new collection ensembles to be created.
    """

    queryset = CollectionsEnsemble.objects.all()
    serializer_class = CollectionsEnsembleSerializer
    permission_classes = (IsAdminUser,)



class CollectionEnsembleDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view presents a specific collection ensemble and allows
    to update or delete it.
    """

    queryset = CollectionsEnsemble.objects.all()
    serializer_class = CollectionsEnsembleSerializer
    permission_classes = (IsAdminUser,)


class CollectionList(generics.ListCreateAPIView):
    """
    This view presents a list a all collections and allows new collection
    to be created.
    """

    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = (IsAdminUser,)



class CollectionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view presents a specific collection and allows to update or delete it.
    """

    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = (IsAdminUser,)



class CollectionPictureList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of collection-picture relations and allows new
    collection-pictuer relations to be created.
    """
    queryset = CollectionPicture.objects.all()
    serializer_class = CollectionPictureSerializer
    permission_classes = (IsAdminUser,)



class CollectionPictureDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific collection-picture relation and allows to
    update or delete it.
    """
    queryset = CollectionPicture.objects.all()
    serializer_class = CollectionPictureSerializer
    permission_classes = (IsAdminUser,)

    def get_object(self):
        try:
            col = Collection.objects.get(pk=self.kwargs['collection'])
            pict = Picture.objects.get(sha1=self.kwargs['picture'])
            col_pict = CollectionPicture.objects.get(
                    collection=col,
                    picture=pict)
        except:
            raise Http404

        return col_pict



@api_view(['GET'])
@permission_classes((IsAdminUser,))
def PicturesPkList(request, format=None):
    """
    Returns a flat list of all pictures sha1s
    ordered by importation date without pagination
    """
    sha1s = Picture.objects.values_list('sha1', flat=True).order_by('-importation_date')

    return Response(sha1s)



@api_view(['GET'])
@permission_classes((IsAdminUser,))
def collections_headers_list(request, format=None):
    """
    Returns a list of all collections and their descendants.
    """
    # get root collection ensemble
    ensemble = CollectionsEnsemble.objects.get(pk=1)
    serializer = CollectionsEnsembleHeadersSerializer(ensemble)

    return Response(serializer.data)




@api_view(['GET'])
@permission_classes((IsAdminUser,))
def collection_pictures(request, pk, format=None):
    """
    Returns a list of all pictures full data (private) of a collection
    without pagination.
    """
    try:
        collection = Collection.objects.get(pk=pk)
    except:
        raise Http404

    pictures = collection.pictures.all()
    serializer = PictureSerializer(pictures, many=True,
            context={'request': request})

    return Response(serializer.data)




@api_view(['GET'])
@permission_classes((IsAdminUser,))
def collections_ensemble_pictures(request, pk, format=None):
    """
    Returns a list of all pictures full data (private) of a collection
    without pagination.
    """
    try:
        ensemble = CollectionsEnsemble.objects.get(pk=pk)
    except:
        raise Http404

    pictures = ensemble.get_pictures()
    serializer = PictureSerializer(pictures, many=True,
            context={'request': request})

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((IsAdminUser, ))
def picture_hits(request, sha1, format=None):
    """ Return number of uniq views for a picture."""
    n_hits = Hit.objects.filter(type="PICT").filter(related_key=sha1).values(
            "ip").distinct().count()
    
    return Response(n_hits)



class PicturesZipExport(generics.ListCreateAPIView):
    """
    This view presents nothing and allows to post a list of
    pictures pks to get an archive of the images files.
    """
    serializer_class = ZipExportSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def get_queryset(self):
        return []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        zip, name = serializer.save()
        zip.seek(0)
        response = FileResponse(zip, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="{}.zip"'.format(name)
        
        return response


