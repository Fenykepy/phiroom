# _*_ coding: utf-8 _*_

import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# location of librairy data (images files)
LIBRAIRY = os.path.join(BASE_DIR, "phiroom/data/images/librairy")
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
# MUST be sorted from bigger to smaller in tupple
PREVIEWS_MAX = [
        (70, 'max-500', 500),
]

# Pour avoir de l'utf-8
DEFAULT_CHARSET = 'utf-8'

## Users configuration
AUTH_USER_MODEL = 'user.User'

# login page
LOGIN_URL = '/login/'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, 'phiroom/data/')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/data/'
LIBRAIRY_URL = os.path.join(MEDIA_URL, 'images/librairy')

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/assets/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(BASE_DIR, 'phiroom/assets/'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)


# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware', # comment for prod
    'stats.middleware.StatsMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'phiroom.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'phiroom.wsgi.application'

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates/'),
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# To add slash at url ends
APPEND_SLASH = True

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.sitemaps',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    #'debug_toolbar', # comment for prod
    #'south',
    'mptt',
    'weblog',
    'portfolio',
    'librairy',
    'conf',
    'user',
    'stats',
    'tasks',
    'contact',
#    'comment',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.request",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
# importing environment specific configuration
try:
    from phiroom.local_settings import *
except ImportError:
    print('settings importation error')
    pass
