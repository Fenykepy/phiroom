from rest_framework import generics
from weblog.serializers import PostSerializer, TagSerializer

from rest_framework.permissions import IsAdminUser
from phiroom.permissions import IsStaffOrReadOnly

from weblog.models import Post, Tag



class PostList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of posts and allows new
    posts to be created.
    """
    queryset = Post.published.all()
    serializer_class = PostSerializer
    permission_classes = (IsStaffOrReadOnly,)    

    # allow staff members to list not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all()
        return Post.published.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)





class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that presents a specific post and allows to
    update or delete it.
    """
    queryset = Post.published.all()
    serializer_class = PostSerializer
    permission_classes = (IsStaffOrReadOnly,)
    
    # allow staff members to retrieve not published posts.
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all()
        return Post.published.all()



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
 
