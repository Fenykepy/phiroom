from rest_framework import serializers

from librairy.models import Picture
from librairy.serializers import PublicPictureSerializer
from portfolio.models import Portfolio, PortfolioPicture
from user.serializers import AuthorSerializer



class PortfolioSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(required=False, allow_null=True)
    slug = serializers.CharField(read_only=True)
    pk = serializers.IntegerField(read_only=True)
    author = AuthorSerializer(read_only=True)
    pictures = serializers.SerializerMethodField()
    url = serializes.HyperlinkedIdentityField(
            view_name='portfolio_detail',
            lookup_field='slug'
    )

    class Meta:
        model = Portfolio
        fields = ()
