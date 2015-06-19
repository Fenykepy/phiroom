from rest_framework import generics
from weblog.serializers import PostSerializer, PostAbstractSerializer, TagSerializer

from rest_framework.permissions import IsAdminUser
from phiroom.permissions import IsStaffOrReadOnly, IsAuthorOrReadOnly

from weblog.models import Post, Tag



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
 
