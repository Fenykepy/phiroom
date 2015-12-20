from rest_framework import generics
from rest_framework import permissions

from user.serializers import *
from user.models import User



class RequestUser(generics.RetrieveUpdateAPIView):
    """
    This views presents request's user and allows to update it.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SafeUserSerializer

    def get_object(self):
        return self.request.user


class AuthorDetail(generics.RetrieveAPIView):
    """
    This view presents a user public's datas.
    """
    permission_classes = (permissions.AllowAny, )
    serializer_class = AuthorSerializer
    queryset = User.objects.all()



