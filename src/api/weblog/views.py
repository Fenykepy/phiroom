from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from weblog.serializers import *
from weblog.models import Post, Tag

from phiroom.permissions import IsStaffOrReadOnly, IsAuthorOrReadOnly




class PostList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of posts and allows new
    posts to be created.
    """
    queryset = Post.published.all()
    serializer_class = PostAbstractSerializer
    permission_classes = (IsStaffOrReadOnly,)    
    lookup_field = 'slug'

    # allow staff members to list not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all().select_related('author')
        return Post.published.all().select_related('author')

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
    update or delete it.
    """
    queryset = Post.published.all().select_related('author'
            ).prefetch_related('tags')
    serializer_class = PostSerializer
    permission_classes = (IsAuthorOrReadOnly,)
    lookup_field = 'slug'
    
    # allow staff members to retrieve not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all().select_related('author'
                    ).prefetch_related('tags')
        return Post.published.all().select_related('author'
                ).prefetch_related('tags')




class PostsListByTag(PostList):
    """
    API endpoint that allows to list posts by tags.
    """

    def get_queryset(self):
        return Post.published.filter(tags__slug=self.kwargs['slug'])


@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdminUser, ))
def flat_tags_list(request, format=None):
    """
    Returns a flat list of all tags name.
    without
    """
    tags = Tag.objects.values_list('name', flat=True).order_by('-n_posts')

    return Response(tags)



@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdminUser, ))
def post_head_list(request, format=None):
    """
    Returns a list of all user's posts headers (slug, pk, name)
    without pagination.
    """
    posts = Post.objects.filter(author=request.user)
    serializer = PostHeadSerializer(posts, many=True)

    return Response(serializer.data)



class TagList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (IsStaffOrReadOnly,)
 


class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific tag and allows to
    update or delete it.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (IsAdminUser,)
 
