from rest_framework import viewsets, generics

from librairy.serializers import *
from librairy.models import PicturesTag, Collection, CollectionsEnsemble, \
        Label, Directory, Picture




class PicturesTagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    queryset = PicturesTag.objects.all()
    serializer_class = PicturesTagSerializer



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

