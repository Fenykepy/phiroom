import hashlib

from django.core.cache import caches
from django.utils.cache import get_cache_key
from django.conf import settings

def clearable_cache_page(timeout,
        cache_alias=settings.CACHE_MIDDLEWARE_ALIAS,
        key_prefix=settings.CACHE_MIDDLEWARE_KEY_PREFIX):
    """
    Wrapper for view that tries getting the page from cache,
    and populate the cache if page isn't in cache yet.

    Keys are build from :
        - key_prefix
        - url md5 hash
        - some datas from headers

    As keys are build with some headers datas (Vary), there can be more
    than one key for each resource.
    To be able to clear all keys relative to one resource, we store
    all keys related to one url in a parallel cache.

    Usage:

    @clearable_cache_page(60 * 10, cache="default", key_prefix="")
    def my_view:
        ...
    
    or in urls.py for class based views:

    url(r^my-url/$', clearable_cache_page(60 * 10, name="my_name_space")(views.my_view.as_view())) 

    Positional arguments:
    timeout -- timeout in seconds. 0 means no cache, None never expires

    Keyword arguments:
    cache -- optionnal, cache to use from your settings, default to default cache
    key_prefix -- optionnal, key prefix to use, default from your settings or ''

    """    
   
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(timeout, 'timeout') 
            # args[0] should contain request
            request = args[0]
            print('expire view cache apiroot')
            # generate key from request

            # try to get key from cache


            print('no cache: execute view')
            response = func(*args, **kwargs)
            print('store generated view in cache')
            return response

        return wrapper
    return decorator


def clear_cache_page(url):
    pass


def _build_cache_key(key_prefix, url_key, vary_key):
    return ".".join([key_prefix, url_key, vary_key])


def _build_url_key(url):

    pass


def _build_vary_key(request):
    pass

