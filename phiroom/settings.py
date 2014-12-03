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
STATIC_ROOT = os.path.join(BASE_DIR, 'phiroom/statics')
STATIC_URL = '/assets/'
# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'phiroom/assets/'),
    os.path.join(BASE_DIR, 'templates/assets/'),
)

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates/'),
)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'weblog',
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
