from django.http import Http404, HttpResponseForbidden

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from phiroom.permissions import IsStaffOrReadOnly

from librairy.serializers import *
from librairy.models import Tag, Collection, CollectionsEnsemble, \
        Label, Directory, Picture

from weblog.models import Post, PostPicture
from weblog.serializers import PostPictureSerializer


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




class DirectoriesList(generics.ListCreateAPIView):
    """
    This view presents a hierarchical tree (list) of all directories
    and allows to create new directories.
    """
    queryset = Directory.objects.filter(parent=None)
    serializer_class = DirectoriesListSerializer
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


class PostPicturesList(generics.ListAPIView):
    """
    This view presents a list of all pictures related to one directory,
    ordered by custom order.
    """
    serializer_class = PictureSerializer
    permissions_classes = (IsAdminUser,)

    def list(self, request, pk, format=None):
        """ 
        Returns a list of all pictures within a weblog post.
        """
        try:
            post = Post.objects.get(pk=pk)
            pictures = post.get_pictures()
        except:
            raise Http404
        # return error if user is not post owner
        if not request.user == post.author:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = PictureSerializer(pictures, many=True,
                context={'request': request}
        )

        return Response(serializer.data)


class PostPictureCreate(APIView):
    """
    Create a new post / picture relation.
    """
    def post(self, request, format=None):
        serializer = PostPictureSerializer(data=request.data)
        if serializer.is_valid():
            # return error if user is not post owner
            if not request.user == serializer.validated_data['post'].author:
                return Response(status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


    
class PostPictureDetail(APIView):
    """
    Update or delete post / picture relation.
    """
    permission_classes = (IsAdminUser,)

    def get_object(self, post, pict):
        try:
            post_pict = PostPicture.objects.get(post=post, picture=pict)
        except:
            raise Http404
        return post_pict

    def is_owner(self, post_pict, user):
        return post_pict.post.author == user


    def delete(self, request, post, pict, format=None):
        """Delete a PostPicture object."""
        post_pict = self.get_object(post, pict)
        if not self.is_owner(post_pict, request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        post_pict.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


    def patch(self, request, post, pict, format=None):
        """Update a PostPicture object."""
        post_pict = self.get_object(post, pict)
        if not self.is_owner(post_pict, request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = PostPictureSerializer(post_pict, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # do not return any data here
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

