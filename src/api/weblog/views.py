from django.http import Http404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from weblog.serializers import *
from weblog.models import Post, Tag
from librairy.models import Picture
from librairy.serializers import PictureShortSerializer

from phiroom.permissions import IsStaffOrReadOnly, IsAuthorOrReadOnly, \
        IsWeblogAuthorOrReadOnly


@api_view(('GET',))
def weblog_root(request, format=None):
    return Response({
        'headers': reverse('posts-headers', request=request, format=format),
        'list': reverse('posts-list', request=request, format=format),
    })

class PostList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of posts and allows new
    posts to be created.
    """
    queryset = Post.published.all()
    serializer_class = PostAbstractSerializer
    permission_classes = (IsWeblogAuthorOrReadOnly, IsStaffOrReadOnly,)    
    lookup_field = 'slug'

    # allow staff members to list not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all()
        return Post.published.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostSerializer
        return PostAbstractSerializer

    # automatically add author on save
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)




class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific post and allows to
    update or delete it if user is author or staff.
    """
    queryset = Post.published.all().prefetch_related('tags')
    serializer_class = PostSerializer
    permission_classes = (IsAuthorOrReadOnly, IsStaffOrReadOnly)
    lookup_field = 'slug'
    
    # allow staff members to retrieve not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all().prefetch_related('tags')
        return Post.published.all().prefetch_related('tags')




class PostsListByTag(PostList):
    """
    API endpoint that allows to list posts by tags.
    """

    def get_queryset(self):
        return Post.published.filter(tags__slug=self.kwargs['slug'])


class PostPictureList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of post-picture relations
    and allows new post-picture relations to be created.
    """
    queryset = PostPicture.objects.all()
    serializer_class = PostPictureSerializer
    permission_classes = (IsWeblogAuthorOrReadOnly, IsStaffOrReadOnly)



class PostPictureDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific post-picture relation
    and allows to update or delete it.
    """
    queryset = PostPicture.objects.all()
    serializer_class = PostPictureSerializer
    permission_classes = (IsStaffOrReadOnly,)
    def get_object(self):
        try:
            post = Post.objects.get(slug=self.kwargs['post'])
            pict = Picture.objects.get(sha1=self.kwargs['picture'])
            post_pict = PostPicture.objects.get(
                    post=post,
                    picture=pict)
        except:
            raise Http404

        return post_pict



@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdminUser, ))
def flat_tags_list(request, format=None):
    """
    Returns a flat list of all tags name.
    without pagination.
    """
    tags = Tag.objects.values_list('name', flat=True).order_by('-n_posts')

    return Response(tags)



@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def posts_headers_list(request, format=None):
    """
    Returns a list of all posts headers (slug, name) without pagination.
    All posts are returned if user is admin.
    Only user's ones else.
    """
    if request.user.is_staff:
        posts = Post.objects.all()
    else:
        posts = Post.objects.filter(author=request.user)

    serializer = PostHeadSerializer(posts, many=True)

    return Response(serializer.data)



@api_view(['GET'])
@permission_classes((IsAuthorOrReadOnly, IsStaffOrReadOnly, ))
def post_pictures(request, slug, format=None):
    """
    Returns a list of all pictures short data (public) of a post
    without paginagion.
    """
    if request.user.is_staff:
        post = Post.objects.get(slug=slug)
    else:
        try:
            post = Post.published.get(slug=slug)
        except:
            raise Http404
    pictures = post.pictures.all().only(
            'sha1', 'title', 'legend',
            'previews_path', 'ratio')
    serializer = PictureShortSerializer(pictures, many=True)

    return Response(serializer.data)


class TagList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (IsWeblogAuthorOrReadOnly, IsStaffOrReadOnly,)
 


class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific tag and allows to
    update or delete it.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (IsStaffOrReadOnly,)
 
