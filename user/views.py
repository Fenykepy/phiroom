from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from user.serializers import *



class RequestUser(generics.RetrieveUpdateAPIView):
    """
    This views presents request's user and allows to update it.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = SafeUserSerializer

    def get_object(self):
        return self.request.user
    
