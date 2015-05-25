"""
Django settings for phiroom project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Media management
MEDIA_ROOT = os.path.join(BASE_DIR, 'phiroom/data')
MEDIA_URL = '/media/'

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'phiroom/statics/')
STATIC_URL = '/assets/'
# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'statics/'),
)

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates/'),
)


# location of librairy data (images files)
# relative to MEDIA_ROOT
LIBRAIRY = "images/librairy"
PREVIEWS_DIR = os.path.join(BASE_DIR, "phiroom/data/images/previews")
PHIROOM = 'http://phiroom.org'



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
DEFAULT_LARGE_PREVIEWS_SIZE = 1024

# large previews destination folder (relative to PREVIEWS_DIR)
LARGE_PREVIEWS_FOLDER = 'large'
LARGE_PREVIEWS_QUALITY = 90

## croped previews for blog posts
# (quality, destination folder (relative to PREVIEWS_DIR), width, height)
# sould be sorted from bigger to smaller in tupple
PREVIEWS_CROP = [
        (70, 'square-500', 500, 500),
]

## previews by width for blog (in case it's need in design)
# (quality, destination folder (relative to PREVIEWS_DIR), width)
# MUST be sorted from bigger to smaller in tupple
PREVIEWS_WIDTH = []

## previews by width for blog (in case it's need in design)
# (quality, destination folder (relative to PREVIEWS_DIR), height)
# MUST be sorted from bigger to smaller in tupple
PREVIEWS_HEIGHT = []


##  max resized previews for librairy
# (quality, destination folder (relative to PREVIEWS_DIR), largest side)
# MUST be sorted from bigger to smaller in tupple,
PREVIEWS_MAX = [
        (70, 'max-500', 500),
]

DEFAULT_CHARSET = 'utf-8'

## Users configuration
AUTH_USER_MODEL = 'user.User'

# login page
#LOGIN_URL = '/login/'


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
    'debug_toolbar',
    'rest_framework',
    'weblog',
    'user',
    'conf',
    'librairy',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
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
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'PAGINATE_BY': 3,
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
