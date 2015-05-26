from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'pictures': reverse('picture-list', request=request, format=format),
        'directorys': reverse('directory-list', request=request, format=format),
        'settings': reverse('last-conf', request=request, format=format),
    })


