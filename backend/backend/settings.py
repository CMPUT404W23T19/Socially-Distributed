"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
import os
from pathlib import Path
from decouple import config  # noqa
from dj_database_url import parse as db_url  # noqa
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    default='django-insecure-r*voj+le#au@@ta!oz$gxu4x&of&zoh=rl$d67ggk1agzr!^)y',
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.environ.get("DJANGO_DEBUG", default=True))
TESTING = bool(os.environ.get("DJANGO_TESTING", default=False))

ALLOWED_HOSTS = ['*']

from django.core.management.commands.runserver import Command as runserver

runserver.default_port = os.environ.get('PORT') 
runserver.default_addr = '0.0.0.0'

# add your new traefik or URL host here
CORS_ORIGIN_WHITELIST = [
    'http://next-django-template.test',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# get db from the other docker container running psql
DATABASES = {
    "default": config("DATABASE_URL", cast=db_url),
}

SERVER_EMAIL = "hello@example.com"

# Email
if (DEBUG):
    # Email settings for mailhog
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = 'mailhog'
    EMAIL_PORT = 1025
else:
    EMAIL_HOST = "smtp.sendgrid.net"
    EMAIL_HOST_USER = config("SENDGRID_USERNAME")
    EMAIL_HOST_PASSWORD = config("SENDGRID_PASSWORD")
    EMAIL_PORT = 587
    EMAIL_USE_TLS = not DEBUG

# Security
SECURE_HSTS_PRELOAD = not DEBUG
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS", default=3600, cast=int)
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG

SECURE_CONTENT_TYPE_NOSNIFF = not DEBUG
SECURE_BROWSER_XSS_FILTER = not DEBUG
X_FRAME_OPTIONS = "DENY"

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'debreach',
    "corsheaders",
    'rest_framework',
    'drf_yasg', # swagger
    'djoser', # auth

    # apps
    'app',
    'common',
    'posts',
    'inbox',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

if TESTING:
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework.authentication.TokenAuthentication',
            'rest_framework.authentication.SessionAuthentication',
        ),
        'PAGE_SIZE': 10
    }
else:
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            'rest_framework.authentication.BasicAuthentication',
        ),
    }

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'loggers': {
        'app': {
            # 'handlers': ['file', 'console'],
            'handlers': ['console'],
            'level': 'INFO',
            'propogate': 'True',
        },
    },
    'handlers': {
        # 'file': {
        #     'level': 'INFO',
        #     'class': 'logging.FileHandler',
        #     'filename': './debug.log',
        #     'formatter': 'someFormat',
        # },
        'console' :{
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        }
    },
}

# DJOSER = {
#     'PASSWORD_RESET_CONFIRM_URL': 'reset-password/{uid}/{token}',
#     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': True,
#     'PASSWORD_RESET_CONFIRM_RETYPE': True,
#     'SERIALIZERS': 
#     {
#         'user_create': 'app.djoserSerializers.UserCreateSerializer',
#     },
#     'PERMISSIONS': {  # temporary
#         'user' : ['rest_framework.permissions.AllowAny'],
#     },
# }

# if debug, JWT should be held longer
if (DEBUG):
    SIMPLE_JWT = {
        'AUTH_HEADER_TYPES': ('Token','Bearer',),
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
        'REFRESH_TOKEN_LIFETIME': timedelta(minutes=480),
    }
else:
    SIMPLE_JWT = {
        'AUTH_HEADER_TYPES': ('Token','Bearer',),
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
        'REFRESH_TOKEN_LIFETIME': timedelta(minutes=360),
    }
