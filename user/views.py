from django.conf import settings
from django.views.generic import ListView, DetailView
from django.views.generic.base import ContextMixin
from user.models import User

from rest_framework import viewsets, generics
from user.serializers import UserSerializer



class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
