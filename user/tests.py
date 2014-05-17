from django.test import TestCase, Client
from user.models import User



# à tester:
#   - Enregistrement d'un nouvel utilisateur
#       - Erreur si le mail est absent
#       - Erreur si le nom existe déjà
#       - Erreur si les mots de passes sont différents
#       - Erreur si le mot de passe est vide
#       - Succes dans les autres cas
#   - Login d'un user
#       - Erreur si l'user n'existe pas
#       - Erreur si le mot de passe ne correspond pas
#       - Succes dans les autres cas
#   - Logout d'un user
#       - Erreur si l'user est toujours loggué
#   - Profil d'un user
#       - Vérifie le bon upload de l'avatar
#       - Vérifie que les champs remplis sont bien sauvegardés
#       - Vérifie qu'un mail est bien envoyé au admins si ils l'ont demandé
#   - Perte de mot de passe
#       - Vérifie qu'un mail est bien envoyé avec un uniqid dans un lien
#       - Vérifie que si le lien est suivi on obtient bien le form de réinitialisation du mot de passe
#       - Vérifie que le nouveau mot de passe est bien pris en compte




class StatusTest(TestCase):
    """url test class"""

    def setUp(self):
        """set up a testing client"""
        self.client = Client() # seting up a Client class to explore urls

    def test_urls(self):
        """test urls and their templates"""
        urls = [{'url': '/account/login/', 'status': 200, 'template': 'user/user_login.html'},
            {'url': '/account/logout/', 'status': 302, 'template': 'user/user_login.html'},
            {'url': '/account/suscription/', 'status': 200, 'template': 'user/user_suscription.html'},
            {'url': '/account/profil/', 'status': 200, 'template': 'user/user_suscription.html'},
            {'url': '/account/recovery/', 'status': 200, 'template': 'user/user_suscription.html'},
        ]
        for elem in urls: # for each urls of the list
            response = self.client.get(elem['url'])
            self.assertEqual(response.status_code, elem['status']) # check if good status code is return
            response = self.client.get(elem['url'], follow=True)
            self.assertEqual(response.templates[0].name, elem['template']) # check if good template is return
    
    def test_create_user(self):
        """test user creation"""
        response = self.client.post('/account/suscription/', {
            'username': 'john',
            'password1': 'tata',
            'password2': 'tata',
            'email': 'john@me.fr',
            }, follow=True # create user john
        )
        self.assertEqual(response.templates[0].name, 'user/user_suscription.html') # check if redirection is ok

        user = User.objects.get(username = 'john')
        self.assertEqual(user.username, 'john') # check if user john exists

    def test_login(self):
        """test user login"""
        self.test_create_user() # create user john
        response = self.client.post('/user/login/', {
            'username': 'john',
            'password': 'tata',
            }, follow=True # try to login user john
        )
        self.assertEqual(response.context['user'].username, 'john') # check if user is connected

    
