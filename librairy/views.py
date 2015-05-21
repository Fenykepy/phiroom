from django.http import Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import viewsets, generics, status

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        Label, Directory, Picture




@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'pictures': reverse('picture-list', request=request, format=format),
    })




class PicturesList(generics.ListCreateAPIView):
    """
    This view presents a list of all pictures and allows new pictures
    to be created.
    """

    queryset = Picture.objects.all()

    def get_serializer_class(self):
        """
        Overide method to return PictureUploadSerializer if method is POST 
        or PictureSerializer if method is GET.
        """
        if self.request.method == 'POST':
            return PictureUploadSerializer
        return PictureSerializer


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        picture = serializer.save()
        # create new serializer with PictureSerializer
        kwargs['context'] = self.get_serializer_context()
        serializer = PictureSerializer(picture, **kwargs)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 




class PictureDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view presents a specific picture and allows to update or delete it.
    """

    queryset = Picture.objects.all()
    serializer_class = PictureSerializer




class PicturesTagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer



class CollectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows collections to be viewed or edited.
    """
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer



class CollectionsEnsembleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows collections ensembles to be viewed or edited.
    """
    queryset = CollectionsEnsemble.objects.all()
    serializer_class = CollectionsEnsembleSerializer



class DirectoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows directorys to be viewed or edited.
    """
    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer



class PictureViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows picture to be viewed or edited.
    """
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer

