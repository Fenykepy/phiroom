from django.core.mail import send_mail

from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from phiroom.settings import EMAIL_SUBJECT_PREFIX, DEFAULT_FROM_EMAIL
from phiroom.permissions import IsStaffOrReadOnly, IsStaffOrCreateOnly

from contact.models import Message, Description
from contact.serializers import *

from user.models import sendContactMail


@api_view(('GET', ))
def contact_root(request, format=None):
    return Response({
        'description': reverse('contact-description', request=request, format=format),
        'descriptions': reverse('contact-descriptions-list', request=request, format=format),
        'messages': reverse('contact-messages-list', request=request, format=format),
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

    def get_serializer_class(self):
        if self.request.user.is_authenticated():
            return AuthenticatedMessageSerializer
        return self.serializer_class
    
    # add ip and user if necessary
    # send mails after saving
    def perform_create(self, serializer):
        ip = self.request.META.get('REMOTE_ADDR')
        if self.request.user.is_authenticated():
            user = self.request.user
            new_message = serializer.save(
                    user=user,
                    name=user.username,
                    mail=user.email,
                    website=user.website,
                    ip=ip
            )
        else :
            new_message = serializer.save(ip=ip)
        # send email to contact users
        subject = "{} New contact message".format(EMAIL_SUBJECT_PREFIX)
        message = (
            "Name: {}\n"
            "Email: {}\n"
            "Website: {}\n"
            "Registered: {}\n"
            "Sent you an mail from contact page:\n\n"
            "Subject: {}\n"
            "Message:\n"
            "{}\n"
        ).format(
            new_message.name,
            new_message.mail,
            new_message.website,
            self.request.user.is_authenticated(),
            new_message.subject,
            new_message.message
        )
        sendContactMail(subject, message)
        # send mail back to sender if necessary :
        if new_message.forward:
            subject = "{} Your message has been sent".format(EMAIL_SUBJECT_PREFIX)
            message = (
                    "Subject: {}\n"
                    "Message:\n"
                    "{}\n"
            ).format(
                new_message.subject,
                new_message.message
            )
            send_mail(
                    subject,
                    message,
                    DEFAULT_FROM_EMAIL,
                    [new_message.mail]
            )



class MessageDetail(generics.RetrieveDestroyAPIView):
    """
    API endpoint that presents a specific description.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer







