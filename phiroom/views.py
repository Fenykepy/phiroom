from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'posts': reverse('post-list', request=request, format=format),
        'tags': reverse('tag-list', request=request, format=format),
        'flat-tags': reverse('flat-tags-list', request=request, format=format),
        'pictures': reverse('picture-list', request=request, format=format),
        'directorys': reverse('directory-list', request=request, format=format),
        'settings': reverse('last-conf', request=request, format=format),
        'request-user': reverse('request-user', request=request, format=format),
        'token-auth': reverse('token-auth', request=request, format=format),
        'token-refresh': reverse('token-refresh', request=request, format=format),
    })


