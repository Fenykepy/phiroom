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
        fields = ('url', 'title', 'draft',
                  'author', 'pictures',
                  'pub_date', 'slug', 'order',
        )


class PortfolioHeadSerializer(PortfolioSerializer):
    class Meta:
        model = Portfolio
        fields = ('title', 'slug', 'pk',)



class PortfolioPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostPicture
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



