#-*- coding: utf-8 -*-

from django.db import models

# conf table
class Conf(models.Model):
    # main configuration of site
    domain = models.CharField(max_length=100, default="phiroom.org", verbose_name="Domaine", 
            help_text="Le nom de domaine du site (ex: phiroom.com, ou www.phiroom.org).")
    title = models.CharField(max_length=100, default="Phiroom", verbose_name="Titre", 
            help_text="Le titre du site (ex: phiroom), il sera indiqué sous le logo pour les mal-voyants, ainsi que comme titre des onglets.")
    title_home = models.CharField(max_length=100, default="Phiroom", verbose_name="Titre de l'accueil", 
            help_text="Le titre de la page d'accueil, indiqué sous le logo de la page d'accueil pour les mal-voyants, ainsi que comme titre de l'onglet.")
    sub_title_home = models.CharField(max_length=100, default="le cms des photographes…", verbose_name="Sous-titre de l'accueil", 
            help_text="Le sous-titre de la page d'accueil, indiqué sous le logo de la page d'accueil ainsi que comme titre de l'onglet.")
    site_logo = models.ImageField(null=True, blank=True, upload_to="images/logos/", verbose_name="Logo du site", 
            help_text="Le logo situé en haut à gauche de chaque pages, laisser vide pour utiliser celui par défaut.")
    home_logo = models.ImageField(null=True, blank=True, upload_to="images/logos/", verbose_name="Logo de l'accueil", 
            help_text="Le logo situé au centre de la page d'accueil, laisser vide pour utiliser celui par défaut.")
    home_page = models.ForeignKey('Page', limit_choices_to = {'is_active': True}, verbose_name="Page d'accueil",
            help_text="La page a utiliser comme page d'accueil (« accueil » par défaut).")
    
    # configuration of notifications
    mail_profil = models.BooleanField(default=True, verbose_name="Mail profil", 
            help_text="Cocher pour que les administrateurs reçoivent un mail chaque fois qu'un utilisateur modifie son profil.")
    mail_suscription = models.BooleanField(default=True, verbose_name="Mail inscription", 
            help_text="Cocher pour que les administrateurs reçoivent un mail chaque fois qu'un nouvel utilisateur s'inscrit.")
    mail_comment = models.BooleanField(default=True, verbose_name="Mail commentaire", 
            help_text="Cocher pour que les administrateurs reçoivent un mail chaque fois qu'un commentaire est posté.")

    # configuration of lists
    n_entrys_per_page = models.PositiveSmallIntegerField(default=5, verbose_name="Pagination", 
            help_text="Le nombre maximum d'entrées par page dans le module weblog.")

    # sharing
    share_twitter = models.BooleanField(default=True, verbose_name="Afficher « partager sur twitter »")
    share_gplus = models.BooleanField(default=True, verbose_name="Afficher « partager sur google plus »")
    share_gplus_public = models.BooleanField(default=True, verbose_name="Afficher « partager en mode public sur google plus »")
    share_fb = models.BooleanField(default=True, verbose_name="Afficher « partager sur facebook »")
    share_vk = models.BooleanField(default=True, verbose_name="Afficher « partager sur vkontakte »")

    # following
    follow_fb = models.BooleanField(default=True, verbose_name="Activer « me suivre sur facebook »",
            help_text="Affiche un logo pointant vers votre page facebook sous les entrées du weblog.")
    fb_link = models.URLField(null=True, blank=True, verbose_name="Lien facebook", 
            help_text="L'url pointant vers votre page facebook, nécessaire si « me suivre sur facebook » est activé.")

    no_fb = models.BooleanField(default=True, verbose_name="Activer « Vous ne me trouverez pas sur facebook »",
            help_text="""Un petit logo amusant pour les militants anti-facebook (et consorts)(<a href="http://www.framablog.org/index.php/post/2011/01/09/facebook-bouton-j-aime-pas-fsf">explications ici</a>), ne s'active que si « me suivre sur facebook » est désactivé.""")

    follow_twitter = models.BooleanField(default=True, verbose_name="Activer « me suivre sur twitter »",
            help_text="Affiche un logo pointant vers votre page twitter sous les entrées du weblog.")
    twitter_link = models.URLField(null=True, blank=True, verbose_name="Lien twitter",
            help_text="L'url pointant vers votre page twitter, nécessaire si « me suivre sur twitter » est activé.")

    follow_gplus = models.BooleanField(default=True, verbose_name="Activer « me suivre sur google plus »",
            help_text="Affiche un logo pointant vers votre page google plus sous les entrées du weblog.")
    gplus_link = models.URLField(null=True, blank=True, verbose_name="Lien gplus",
            help_text="L'url pointant vers votre page google plus, nécessaire si « me suivre sur google plus » est activé.")

    follow_flickr = models.BooleanField(default=True, verbose_name="Activer « me suivre sur flickr »",
            help_text="Affiche un logo pointant vers votre page flickr sous les entrées du weblog.")
    flickr_link = models.URLField(null=True, blank=True, verbose_name="Lien flickr",
            help_text="L'url pointant vers votre page flickr, nécessaire si « me suivre sur flickr » est activé.")

    follow_vk = models.BooleanField(default=True, verbose_name="Activer « me suivre sur vkontakte »",
            help_text="Affiche un logo pointant vers votre page vkontakte sous les entrées du weblog.")
    vk_link = models.URLField(null=True, blank=True, verbose_name="Lien vkontakte",
            help_text="L'url pointant vers votre page vkontakte, nécessaire si « me suivre sur vkontakte » est activé.")

    follow_feed = models.BooleanField(default=True, verbose_name="Activer la syndication de contenu",
            help_text="""Active la syndication de contenu pour le site (<a href="http://fr.wikipedia.org/wiki/Syndication_de_contenu">explications ici</a>).""")
    rss_feed = models.URLField(null=True, blank=True, verbose_name="Lien rss")
    feed_title = models.CharField(max_length=100, default="Phiroom, l'actualité du site", verbose_name="Titre de la syndication de contenu", 
            help_text="Le titre principal de la page de syndication de contenu.")
    feed_description = models.TextField(verbose_name="Description de la syndication de contenu",
            default="Dernières entrées du weblog de phiroom",
            help_text="La description du flux de syndication (qui concerne les n dernières entrées du module weblog.")
    feed_number = models.PositiveSmallIntegerField(default=50, verbose_name="Nombre de dernières entrées dans la page de syndication de contenu ")



    follow_mail = models.BooleanField(default=True, verbose_name="Activer « me suivre par mail »",
            help_text="Autorise les visiteurs à s'inscrire anonymement pour recevoir un mail à chaque nouvelle publication.")


    # configuration of side menu lists
    n_last_articles_menu = models.PositiveSmallIntegerField(default=10, verbose_name="Nombre de derniers articles dans le menu latéral")
    n_last_gallerys_menu = models.PositiveSmallIntegerField(default=10, verbose_name="Nombre de dernières galeries dans le menu latéral")
    n_last_pictofdays_menu = models.PositiveSmallIntegerField(default=10, verbose_name="Nombre de dernières images du jour dans le menu latéral")
    n_last_portfolios_menu = models.PositiveSmallIntegerField(default=1000, verbose_name="Nombre de dernier portfolios dans le menu latéral")
    
    # configurations of views
    print_comment = models.BooleanField(default=False, verbose_name="Afficher commentaires",
            help_text="Si activé les commentaires s'affichent directement sous l'entrée concernée (peut ralentir le chargement de la page, sinon les commentaires se chargent en asynchrone lors du clic sur un lien (recommandé).")

    # configuration of configuration
    comment = models.TextField(verbose_name="Commentaire",
            help_text="Un court commentaire concernant les modifications apportées à la configuration (utile pour se retrouver dans les vieilles versions).")
    date = models.DateTimeField(auto_now_add=True, auto_now=False, verbose_name="Date d'enregistrement")
    

    def __str__(self):
        return "%s" %self.comment

# page tables
class Page(models.Model):
    title = models.CharField(max_length=100, verbose_name="Titre")
    name = models.CharField(max_length=100, verbose_name="Nom")
    is_in_main_menu = models.BooleanField(default=False, verbose_name="Afficher dans le menu principal")
    position_in_main_menu = models.PositiveSmallIntegerField(default=100)
    is_in_home_menu = models.BooleanField(default=False, verbose_name="Afficher dans le menu de la page d'accueil")
    position_in_home_menu = models.PositiveSmallIntegerField(default=100)
    is_active = models.BooleanField(default=True, verbose_name="Activer")
    content = models.TextField(null=True, verbose_name="Contenu")
    source = models.TextField(null=True, verbose_name="Source")
    reverse_url = models.URLField()


    def __str__(self):
        return "%s" %self.title

