from rest_framework import generics
from rest_framework import permissions

from user.serializers import *



class RequestUser(generics.RetrieveUpdateAPIView):
    """
    This views presents request's user and allows to update it.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SafeUserSerializer

    def get_object(self):
        return self.request.user



