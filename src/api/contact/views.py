from rest_framework import generics, permissions

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from contact.models import Message, Description
from contact.serializers import MessageSerializer, DescriptionSerializer

from phiroom.permissions import IsStaffOrReadOnly, IsStaffOrCreateOnly


@api_view(('GET', ))
def contact_root(request, format=None):
    return Response({
        'description': reverse('contact-description', request=request, format=format),
        'descriptions': reverse('contact-descriptions-list', request=request, format=format),
        #'messages': reverse('contact-description', request=request, format=format),
    })



class LastDescription(generics.RetrieveAPIView):
    """
    API endpoint that presents the last description object.
    """
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer
    permission_classes = (permissions.AllowAny, )
    def get_object(self):
        return Description.objects.latest()



class DescriptionList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of descriptions and allows
    new descriptions to be created.
    """
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer

    # automatically add author on save
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



class DescriptionDetail(generics.RetrieveAPIView):
    """
    API endpoint that presents a specific description.
    """
    queryset = Description.objects.all()
    serializer_class = DescriptionSerializer


class MessageList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of messages and allows
    new messages to be created and send.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsStaffOrCreateOnly, )
    
    # add ip and user if necessary
    # send mails after saving
    def perform_create(self, serializer):
        ip = self.request.META.get('REMOTE_ADDR')
        serializer.save(ip=ip)


