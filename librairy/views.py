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
    This view presents a list of all pictures and allows new pictures
    to be created.
    """

    def get(self, request, format=None):
        pictures = Picture.objects.all()
        serializer = PictureSerializer(pictures, many=True)
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = PictureUploadSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PictureDetail(APIView):
    """
    This view presents a specific picture and allows to update or delete it.
    """

    def get_object(self, pk):
        try:
            return Picture.objects.get(pk=pk)
        except Picture.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        picture = self.get_object(pk)
        serializer = PictureSerializer(picture)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        picture = self.get_object(pk)
        serializer = PictureSerializer(picture, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        picture = self.get_object(pk)
        # get number of other pictures with same sha1
        #(and so previews and source file)
        nb = Picture.objects.filter(sha1=picture.sha1).count()
        # if only one picture remain, delete previews and source_file
        if nb == 1:
            picture.delete_previews()
            picture.delete_picture()
        picture.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





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

