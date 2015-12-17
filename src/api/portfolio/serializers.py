from rest_framework import serializers

from librairy.models import Picture
from portfolio.models import Portfolio, PortfolioPicture



class PortfolioSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(required=False, allow_null=True)
    pictures = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(
            view_name='portfolio-detail',
            lookup_field='slug'
    )

    class Meta:
        model = Portfolio
        fields = ('url', 'title', 'draft',
                  'author', 'pictures',
                  'pub_date', 'slug', 'order',
        )
        read_only_fields = ('slug', 'author')


    def get_pictures(self, object):
        # because many to many relation order is not respected
        # by drf, we get list manually
        return object.get_pictures().values_list('picture', flat=True)



class PortfolioPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPicture



class PortfolioHeadSerializer(PortfolioSerializer):
    class Meta:
        model = Portfolio
        fields = ('title', 'slug')

