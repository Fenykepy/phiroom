from rest_framework import serializers

from librairy.models import Picture
from librairy.serializers import PictureShortSerializer
from portfolio.models import Portfolio, PortfolioPicture
from user.serializers import AuthorSerializer



class PortfolioSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(required=False, allow_null=True)
    #pictures = serializers.SerializerMethodField()
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
        picts = object.get_pictures()
        serializer = PictureShortSerializer(picts, many=True)
        return serializer.data


class PortfolioHeadSerializer(PortfolioSerializer):
    class Meta:
        model = Portfolio
        fields = ('title', 'slug')



class PortfolioPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPicture
        fields = ('picture', 'portfolio', 'order',)

    def create(self, validated_data):
        """
        Create a new PortfolioPicture object.
        """
        portfolio_picture, created = PortfolioPicture.objects.get_or_create(
                portfolio=validated_data['portfolio'],
                picture=validated_data['picture'])
        return portfolio_picture

    def update(self, instance, validated_data):
        """
        Update and return an existing "PortfolioPicture".
        """
        # only order should be updatable
        instance.order = validated_data.get('order', instance.order)
        instance.save()

        return instance



