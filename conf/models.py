from django.db import models
from django.conf import settings


class Conf(models.Model):
    """Main configuration of phiroom."""
    domain = models.CharField(max_length=100, default="phiroom.org",
            verbose_name="Domain name",
            help_text="Website's domain name, e.g. phiroom.com, \
                    or www.phiroom.org.")
    title = models.CharField(max_length=100, default="Phiroom",
            verbose_name="Title",
            help_text="Website's main title, will be set under page logo.",)
    logo = models.ImageField(null=True, blank=True,
            upload_to="images/logos/",
            verbose_name="Website's logo.",
            help_text="The logo you can see on each page header. \
                    Leave blank to use default one.")
    n_posts_per_page = models.PositiveSmallIntegerField(default=3,
            verbose_name="Paginate by",
            help_text="Maximum number of posts per list page.")
    home_page = models.ForeignKey('Page', default=1,
            limit_choices_to = {'is_active': True},
            verbose_name="Home page",
            help_text="Page to use as \"home page\" (when \"/\" url \
                    is given.")
    large_previews_size = models.PositiveIntegerField(
            choices=settings.LARGE_PREVIEWS_SIZE_CHOICES,
            default=settings.DEFAULT_LARGE_PREVIEWS_SIZE,
            verbose_name="Size of the biggest public previews",
            help_text="A preview regeneration is necessary after each \
                    change of this setting (import folder again with \
                    \"regenerate previews of existing images\" option).")
    fb_link = models.URLField(null=True, blank=True,
            verbose_name="Facebook page link",
            help_text="Url to a facebook page, will be displayed on \
                    under a small logo.")
    twitter_link = models.URLField(null=True, blank=True,
            verbose_name="Twitter page link",
            help_text="Url to a twitter page, will be displayed on \
                    under a small logo.")
    gplus_link = models.URLField(null=True, blank=True,
            verbose_name="Google plus page link",
            help_text="Url to a google plus page, will be displayed on \
                    under a small logo.")
    flickr_link = models.URLField(null=True, blank=True,
            verbose_name="Flickr page link",
            help_text="Url to a flickr page, will be displayed on \
                    under a small logo.")
    vk_link = models.URLField(null=True, blank=True,
            verbose_name="Vkontakte page link",
            help_text="Url to a vkontakte page, will be displayed on \
                    under a small logo.")

    registration_mail = models.BooleanField(default=True,
            verbose_name="Registration mail",
            help_text = "Whether or not admins receive a mail for each \
                    new registration.")
    comment = models.TextField(verbose_name="Comment", default='',
            help_text = "A short word about changements given to this \
                    configuration.")
    date = models.DateTimeField(auto_now_add=True, auto_now=True, null=True,
            blank=True, db_index=True, verbose_name="Configuration date")

    class Meta:
        get_latest_by = 'date'


    def get_home_page_url_name(self):
        return self.home_page.url_name

    def save(self, **kwargs):
        """Always save as a new conf entry."""
        self.pk = None
        super(Conf, self).save()


    def __str__(self):
        return "{} {}".format(str(self.date)[:19], self.comment)



class MainMenuManager(models.Manager):
    """Returns a queryset with ordered pages which are in main menu."""
    def get_queryset(self):
        return super(MainMenuManager, self).get_queryset().filter(
                is_in_main_menu=True).values(
                        'url_name',
                        'name',
                        'title',
                    )


class PageInfoManager(models.Manager):
    """Returns a queryset with page infos."""
    def get_queryset(self):
        return super(PageInfoManager, self).get_queryset().values(
                'title',
                'name',
            )



class Page(models.Model):
    """Static pages configuration."""
    name = models.CharField(max_length=100, verbose_name="Name",
            db_index=True)
    title = models.CharField(max_length=100, verbose_name="Title")
    is_in_main_menu = models.BooleanField(default=False, db_index=True,
            verbose_name="Show in main menu")
    position_in_main_menu = models.PositiveSmallIntegerField(default=100)
    is_active = models.BooleanField(default=True, verbose_name="Activate")
    content = models.TextField(null=True, verbose_name="Contenu", blank=True)
    source = models.TextField(null=True, verbose_name="Source", blank=True)
    url_name = models.CharField(max_length=254)

    ## managers
    objects = models.Manager()
    main_menu = MainMenuManager()
    page_info = PageInfoManager()


    class Meta:
        ordering = ['position_in_main_menu', 'pk']

    def __str__(self):
        return "%s" % self.title


