from django import forms
from article.forms import Form

from conf.models import Conf

class SettingsForm(forms.ModelForm):
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
                'n_last_articles_menu',
                'n_last_gallerys_menu',
                'n_last_pictofdays_menu',
                'n_last_portfolios_menu',
                'print_comment',
                'comment',
                )

    def __init__(self, *args, **kwargs):
        super(SettingsForm, self).__init__(*args, **kwargs)
        self.label_suffix=''


