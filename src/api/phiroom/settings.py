"""
Django settings for phiroom project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Media management
MEDIA_ROOT = os.path.join(BASE_DIR, 'phiroom/data')
MEDIA_URL = '/media/'

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'phiroom/assets/')
STATIC_URL = '/assets/'
# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'assets/'),
)
TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates/'),
)


# location of librairy data (images files)
# relative to MEDIA_ROOT
LIBRAIRY = "images/librairy"
PREVIEWS_DIR = os.path.join(BASE_DIR, "phiroom/data/images/previews")
PHIROOM = 'http://phiroom.org'

# words which cannot be used as slug (because they are part of urls)
RESERVED_WORDS = ['headers',]

# Previews generation settings
# JPEG quality shouldn't be more than 95 and less than 50.
# 90 for big previews and 70 for small seems to be good values.

# For faster generation, previews MUST be sorted in tuples from bigger
# to smaller size. (like this it reuse previous preview if possible
# instead of loading full size again

# choices available in conf for big previews
LARGE_PREVIEWS_SIZE_CHOICES = (
        (0, 'Taille réelle'),
        (700, '700px pour le grand côté'),
        (1024, '1024px pour le grand côté'),
        (2048, '20148px pour le grand côté'),
)

# default previews size for big previews (must also
# be in LARGE_PREVIEWS_CHOICES), leave 0 for full size
DEFAULT_LARGE_PREVIEWS_SIZE = 1024 # lightbox, single view in librairy

# large previews destination folder (relative to PREVIEWS_DIR)
LARGE_PREVIEWS_FOLDER = 'large'
LARGE_PREVIEWS_QUALITY = 90

## croped previews for blog posts
# (quality, destination folder (relative to PREVIEWS_DIR), width, height)
# sould be sorted from bigger to smaller in tupple
PREVIEWS_CROP = [
        (70, 'square-180', 180, 180), # thumbs in weblog
]

## previews by width for blog (in case it's need in design)
# (quality, destination folder (relative to PREVIEWS_DIR), width)
# MUST be sorted from bigger to smaller in tupple
PREVIEWS_WIDTH = [
        (70, 'width-750', 750), # main thumb in weblog
]

## previews by width for blog (in case it's need in design)
# (quality, destination folder (relative to PREVIEWS_DIR), height)
# MUST be sorted from bigger to smaller in tupple
PREVIEWS_HEIGHT = [
        (70, 'height-600', 600), # thumbs in portfolios
]


##  max resized previews for librairy
# (quality, destination folder (relative to PREVIEWS_DIR), largest side)
# MUST be sorted from bigger to smaller in tupple,
PREVIEWS_MAX = [
        (70, 'max-500', 500), # librairy vignets
]

DEFAULT_CHARSET = 'utf-8'

## Users configuration
AUTH_USER_MODEL = 'user.User'

# login page
#LOGIN_URL = '/login/'


## HEADERS
# allow CORS from everywhere
CORS_ORIGIN_ALLOW_ALL = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/


# Application definition

# To add slash at url ends
APPEND_SLASH = True


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'debug_toolbar',
    'rest_framework',
    'portfolio',
    'weblog',
    'contact',
    'user',
    'conf',
    'librairy',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    'django.core.context_processors.request',
)

ROOT_URLCONF = 'phiroom.urls'

WSGI_APPLICATION = 'phiroom.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAdminUser',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication', # for api
        'rest_framework.authentication.SessionAuthentication', # for django rest framework browser
    ),
    'PAGINATE_BY': 100,
    'PAGINATE_BY_PARAM': 'page_size',
}


# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

USE_I18N = True

USE_L10N = True

USE_TZ = True



# importing environment specific configuration
try:
    from phiroom.local_settings import *
except ImportError:
    print('settings importation error')
    pass


# set jwt token settings here because secret key (in local_settings) must be available
JWT_AUTH = {
    'JWT_ENCODE_HANDLER':
    'rest_framework_jwt.utils.jwt_encode_handler',

    'JWT_DECODE_HANDLER':
    'rest_framework_jwt.utils.jwt_decode_handler',

    'JWT_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_payload_handler',

    'JWT_PAYLOAD_GET_USER_ID_HANDLER':
    'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',

    'JWT_RESPONSE_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_response_payload_handler',

    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_ALGORITHM': 'HS256',
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7),
    'JWT_AUDIENCE': None,
    'JWT_ISSUER': None,

    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=365),

    'JWT_AUTH_HEADER_PREFIX': 'JWT',
}
