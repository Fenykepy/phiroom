from django.test import TestCase, Client
from user.models import User



# à tester:
#   - Enregistrement d'un nouvel utilisateur
#       - Erreur si le mail est absent
#       - Erreur si le nom existe déjà
#       - Erreur si les mots de passes sont différents
#       - Erreur si le mot de passe est vide
#   - Profil d'un user
#       - Vérifie le bon upload de l'avatar
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
        urls = [
                {
                    'url': '/login/',
                    'status': 200,
                    'template': 'weblog/weblog_forms.html'
                },
                {
                    'url': '/logout/',
                    'status': 302,
                    'template': 'weblog/weblog_forms.html'
                },
                {
                    'url': '/register/',
                    'status': 200,
                    'template': 'weblog/weblog_forms.html'
                },
                {
                    'url': '/profil/',
                    'status': 302, # redirect to login page
                    'template': 'weblog/weblog_forms.html'
                },
                #{
                #    'url': '/account/recovery/',
                #    'status': 200,
                #    'template': 'weblog/weblog_forms.html'
                #},
        ]

        for elem in urls: # for each urls of the list
            response = self.client.get(elem['url'])
            print(elem['url'])
            # check if good status code is return
            self.assertEqual(response.status_code, elem['status']) 
            response = self.client.get(elem['url'], follow=True)
            # check if good template is return
            self.assertEqual(response.templates[0].name, elem['template'])
  


    def test_create_user(self):
        """test user creation"""
        response = self.client.post('/register/', {
            'username': 'john',
            'password1': 'tata',
            'password2': 'tata',
            'email': 'john@me.fr',
            }, follow=True # create user john
        )
        # check if redirection is ok
        self.assertEqual(response.templates[0].name, 'weblog/weblog_forms.html') 

        user = User.objects.get(username = 'john')
        self.assertEqual(user.username, 'john') # check if user john exists



    def test_login(self):
        """test user login."""
        self.test_create_user() # create user john
        response = self.client.post('/login/', {
            'username': 'john',
            'password': 'tata',
            }, follow=True # try to login user john
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['user'].username, 'john') # check if user is connected


    def test_fail_login(self):
        """test that user login fail with wrong parameters."""
        self.test_create_user() # create user john
        response = self.client.post('/login/', {
            'username': 'Gérard',
            'password': 'tata',
            }, follow=True
        )

        self.assertEqual(response.templates[0].name, 'weblog/weblog_forms.html')
        self.assertNotEqual(response.context['user'].username, 'Gérard')


        response = self.client.post('/login/', {
            'username': 'john',
            'password': 'titi',
            }, follow=True
        )

        self.assertEqual(response.templates[0].name, 'weblog/weblog_forms.html')
        self.assertNotEqual(response.context['user'].username, 'Gérard')



    def test_logout(self):
        """Assert that user correctly logged out."""
        self.test_create_user()
        login = self.client.login(username='john', password='tata')
        self.assertEqual(login, True)

        response = self.client.get('/logout/', follow=True)

        # assert user is logged out
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.context['user'].username, 'john')



    def test_profil(self):
        """Assert that user can change it's profil."""
        self.test_create_user() # create user john
        response = self.client.post('/profil/', {
            'email': 'john@toto.fr',
            'first_name': 'john',
            'last_name': 'master',
            'author_name': 'John Master',
            'signature': 'John Master',
            'web_site': 'http://john.master.com',
            'weblog_mail_newsletter': 'on',

            }, follow=True
        )

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_list.html')

        # assert user info has been save in db
        user = User.objects.get(username='john')
        self.assertEqual(user.email, 'john@toto.fr')
        self.assertEqual(user.first_name, 'john')
        self.assertEqual(user.last_name, 'master')
        self.assertEqual(user.author_name, 'John Master')
        self.assertEqual(user.signature, 'John Master')
        self.assertEqual(user.web_site, 'http://john.master.com/')
        self.assertEqual(user.weblog_mail_newsletter, True)



    def test_profil_staff_fields(self):
        # create normal user
        user = User.objects.create_user(
                username='jacob',
                email='jacob@toto.com',
                password='top_secret'
        )

        # login with that user
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)

        # change user'profil
        response = self.client.post('/profil/', {
            'email': 'jacob@toto.fr',
            'first_name': 'jacob',
            'last_name': 'toto',
            'author_name': 'Jacob Toto',
            'signature': 'Jacob Toto',
            'web_site': 'http://jacob.toto.com',
            'weblog_mail_newsletter': 'on',
            'mail_contact': 'on',
            'mail_registration': 'on',

            }, follow=True
        )

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_list.html')

        user = User.objects.get(username='jacob')
        self.assertEqual(user.mail_contact, False)
        self.assertEqual(user.mail_registration, False)



    def test_profil_staff(self):
        """Assert that staff users have other fields."""
        # create staff user
        user = User.objects.create_user(
                username='jacob',
                email='jacob@toto.com',
                password='top_secret'
        )
        user.is_staff = True
        user.save()

        # login with that user
        login = self.client.login(username='jacob', password='top_secret')
        self.assertEqual(login, True)

        # change user'profil
        response = self.client.post('/profil/', {
            'email': 'jacob@toto.fr',
            'first_name': 'jacob',
            'last_name': 'toto',
            'author_name': 'Jacob Toto',
            'signature': 'Jacob Toto',
            'web_site': 'http://jacob.toto.com',
            'weblog_mail_newsletter': 'on',
            'mail_contact': 'on',
            'mail_registration': 'on',
            }, follow=True
        )

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_list.html')

        # assert user info has been save in db
        user = User.objects.get(username='jacob')
        self.assertEqual(user.email, 'jacob@toto.fr')
        self.assertEqual(user.first_name, 'jacob')
        self.assertEqual(user.last_name, 'toto')
        self.assertEqual(user.author_name, 'Jacob Toto')
        self.assertEqual(user.signature, 'Jacob Toto')
        self.assertEqual(user.web_site, 'http://jacob.toto.com/')
        self.assertEqual(user.weblog_mail_newsletter, True)
        self.assertEqual(user.mail_contact, True)
        self.assertEqual(user.mail_registration, True)



    def test_user_registration(self):
        """Assert that new users can register correctly."""
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            }, follow=True
        )

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')

        # assert user has been created in db
        user = User.objects.get(username='toto')
        
        # assert user is logged in
        self.assertEqual(response.context['user'].username, 'toto')



    def test_user_registration_fail(self):
        """Assert that user is nor created nor logged in with
        wrong parameters.
        """
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password1': 'kirikiki',
            'password2': 'kirikiko',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')



        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')

        response = self.client.post('/register/', {
            'username': 'toto',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')

        response = self.client.post('/register/', {
            'email': 'toto',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')



        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password2': 'kirikiko',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')




        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password1': 'kirikiko',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')



    

        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            }, follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'weblog/weblog_forms.html')


