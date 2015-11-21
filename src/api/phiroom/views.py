from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'portfolio': reverse('portfolio-root', request=request, format=format),
        
        'posts': reverse('posts-list', request=request, format=format),
        'pictures': reverse('pictures-list', request=request, format=format),
        'tags': reverse('tags-list', request=request, format=format),
        'flat-tags': reverse('flat-tags-list', request=request, format=format),
        'directorys': reverse('directories-list', request=request, format=format),
        'settings': reverse('last-conf', request=request, format=format),
        'request-user': reverse('request-user', request=request, format=format),
        'token-auth': reverse('token-auth', request=request, format=format),
        'token-refresh': reverse('token-refresh', request=request, format=format),
    })


