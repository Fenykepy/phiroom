from rest_framework import generics

from contact.models import Message, Description
from contact.serializers import MessageSerializer, DescriptionSerializer

from phiroom.permissions import IsStaffOrReadOnly



