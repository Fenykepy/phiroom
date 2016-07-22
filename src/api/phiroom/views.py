from django.middleware import csrf

from django.views.decorators.cache import cache_page

from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from phiroom.serializers import CSRFTokenSerializer

@cache_page(None) # we cache forever
@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'portfolio': reverse('portfolio-root', request=request, format=format),
        'contact': reverse('contact-root', request=request, format=format),
        'weblog': reverse('weblog-root', request=request, format=format),
        'stats': reverse('hits-list', request=request, format=format),
        'pictures': reverse('pictures-list', request=request, format=format),
        'tags': reverse('tags-list', request=request, format=format),
        'flat-tags': reverse('flat-tags-list', request=request, format=format),
        'settings': reverse('last-conf', request=request, format=format),
        'request-user': reverse('request-user', request=request, format=format),
        'token-auth': reverse('token-auth', request=request, format=format),
        'token-refresh': reverse('token-refresh', request=request, format=format),
    })


def get_or_create_csrf_token(request):
    token = request.META.get('CSRF_COOKIE', None)
    if token is None:
        token = csrf._get_new_csrf_key()
        request.META['CSRF_COOKIE'] = token
    request.META['CSRF_COOKIE_USED'] = True
    return token


@api_view(('GET', ))
@permission_classes((AllowAny, ))
def obtain_csrf_token(request, format=None):
    token = get_or_create_csrf_token(request)
    serializer = CSRFTokenSerializer({'token': token})
    return Response(serializer.data)
