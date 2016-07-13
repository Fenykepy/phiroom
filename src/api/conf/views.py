from django.views.decorators.cache import cache_page

from rest_framework import generics
from phiroom.permissions import IsStaffOrReadOnly

from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie

from conf.serializers import *

class LastConf(generics.RetrieveUpdateAPIView):
    """
    This view presents a specific conf and allows to update it
    (in fact creating a new one).
    """

    permission_classes = (IsStaffOrReadOnly,)
    serializer_class = ConfSerializer

    def get_object(self):
        return Conf.objects.latest()



class MainMenu(generics.ListAPIView):
    """
    This view presents pages for main menu.
    """

    permission_classes = (IsStaffOrReadOnly,)
    serializer_class = PageSerializer
    queryset = Page.main_menu.all()
