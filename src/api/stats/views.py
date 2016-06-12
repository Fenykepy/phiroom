from rest_framework import generics


from phiroom.permissions import IsStaffOrCreateOnly

from stats.models import  Hit

from stats.serializers import HitSerializer


class HitList(generics.ListCreateAPIView):
    """
    API endpoint that presents a list of hits
    and allows new hits to be created.
    """
    queryset = Hit.objects.all()
    serializer_class = HitSerializer
    permission_classes = (IsStaffOrCreateOnly, )

    # automatically add user and IP on save
    def perform_create(self, serializer):
        if self.request.user.is_authenticated():
            serializer.save(
                user=self.request.user,
                request_ip=self.request.META.get('REMOTE_ADDR')
            )
        else:
            serializer.save(
                request_ip=self.request.META.get('REMOTE_ADDR')
            )
    



