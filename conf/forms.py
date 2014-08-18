from weblog.forms import ModelForm

from conf.models import Conf

class SettingsForm(ModelForm):
    """Configuration edition form."""
    class Meta:
        model = Conf
        fields = ('domain', 
                'title', 
                'title_home', 
                'sub_title_home', 
                'site_logo', 
                'home_logo', 
                'home_page',
                'mail_profil', 
                'mail_suscription', 
                'n_entrys_per_page',
                'large_previews_size',
                'follow_fb',
                'fb_link',
                'no_fb',
                'follow_twitter',
                'twitter_link',
                'follow_gplus',
                'gplus_link',
                'follow_flickr',
                'flickr_link',
                'follow_vk',
                'vk_link',
                'follow_feed',
                'feed_title',
                'feed_description',
                'feed_number',
                'follow_mail',
                'n_last_entrys_menu',
                'n_last_portfolios_menu',
                'print_comment',
                'comment',
                )


