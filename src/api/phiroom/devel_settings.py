# Settings de développement
#DEBUG = True
DEBUG = True

## Cache configuration
## for debug
DUMMY = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
}
LOCMEM = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
}

CACHES = DUMMY # do not cache for testing
#CACHES = LOCMEM # cache to test caching


ADMINS = (
    # ('Your Name', 'your_email@example.com'),
    ('Lavilotte-Rolle Frédéric', 'pro@lavilotte-rolle.fr'),
)

MANAGERS = ADMINS


INTERNAL_IPS = ('127.0.0.1',)

## Email configuration
DEFAULT_FROM_EMAIL = 'webmaster@phiroom.org'
EMAIL_SUBJECT_PREFIX = '[Phiroom]'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

# Make this unique, and don't share it with anybody.
SECRET_KEY = '#v04u18pw)rsgry7fhw*7)t0^)nm!l6fod90fb7y8ckbu0u8yx'


# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['127.0.0.1']

# Allow CORS for developpment
CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
    '127.0.0.1:3000'
)
CORS_ALLOW_CREDENTIALS = True

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/Paris'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1
