from rest_framework import generics

from conf.serializers import *


class LastConf(generics.RetrieveUpdateAPIView):
    """
    This view presents a specific conf and allows to update it
    (in fact creating a new one).
    """

    serializer_class = ConfSerializer

    def get_object(self):
        return Conf.objects.latest()


class MainMenu(generics.ListAPIView):
    """
    This view presents pages for main menu.
    """

    serializer_class = PageSerializer
    queryset = Page.main_menu.all()
