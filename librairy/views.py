from django.http import Http404

from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        Label, Directory, Picture




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



class DirectorysList(generics.ListCreateAPIView):
    """
    This view presents a hierarchical tree (list) of all directorys
    and allows to create new directorys.
    """
    queryset = Directory.objects.filter(parent=None)
    serializer_class = DirectorysListSerializer
    permission_classes = (IsAdminUser,)



class DirectoryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view presents a specific directory and allows to update or delete it.
    """

    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer
    permission_classes = (IsAdminUser,)



class DirectoryPicturesList(generics.ListAPIView):
    """
    This view presents a list of all pictures related to one directory.
    """
    serializer_class = PictureSerializer
    permission_classes = (IsAdminUser,)

    def list(self, request, pk, format=None):
        """
        returns a list of all pictures in a directory.
        "-" pk will return pictures with no directory.
        """
        if pk == '-':
            pictures = Picture.objects.filter(directory=None)
        # get related directory
        else:
            try:
                dir = Directory.objects.get(pk=pk)
                pictures = dir.get_children_pictures()
            except:
                raise Http404
        # get directory's pictures
        serializer = PictureSerializer(pictures, many=True,
                context={'request': request}
        )

        return Response(serializer.data)


