from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework import viewsets

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        Label, Directory, Picture





class PicturesList(APIView):
    """
    Create a new Picture through PictureFactory or list all pictures.
    """
    def get(self, request, format=None):
        pictures = Picture.objects.all()
        serializer = PictureSerializer(pictures, many=True)
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = PictureUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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

