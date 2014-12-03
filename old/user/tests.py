from django.test import TestCase, Client
from user.models import User



# à tester:
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
                    'template': 'user/user_login.html'
                },
                {
                    'url': '/logout/',
                    'status': 302,
                    'template': 'user/user_login.html'
                },
                {
                    'url': '/register/',
                    'status': 200,
                    'template': 'user/user_registration.html'
                },
                {
                    'url': '/profil/',
                    'status': 302, # redirect to login page
                    'template': 'user/user_login.html'
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
            response = self.client.get(
                    elem['url'],
                    HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                    follow=True
            )
            # check if good template is return
            self.assertEqual(response.templates[0].name, elem['template'])
  


    def test_create_user(self):
        """test user creation"""
        response = self.client.post('/register/', {
            'username': 'john',
            'password1': 'tata',
            'password2': 'tata',
            'email': 'john@me.fr',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True # create user john
        )
        # check if redirection is ok
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html') 

        user = User.objects.get(username = 'john')
        self.assertEqual(user.username, 'john') # check if user john exists



    def test_login(self):
        """test user login."""
        self.test_create_user() # create user john
        response = self.client.post('/login/', {
            'username': 'john',
            'password': 'tata',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True # try to login user john
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['user'].username, 'john') # check if user is connected
        # check if redirection is ok
        self.assertEqual(response.templates[0].name,
                'user/user_login.html') 




    def test_fail_login(self):
        """test that user login fail with wrong parameters."""
        self.test_create_user() # create user john
        response = self.client.post('/login/', {
            'username': 'Gérard',
            'password': 'tata',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        self.assertEqual(response.templates[0].name, 'user/user_login.html')
        self.assertNotEqual(response.context['user'].username, 'Gérard')


        response = self.client.post('/login/', {
            'username': 'john',
            'password': 'titi',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        self.assertEqual(response.templates[0].name, 'user/user_login.html')
        self.assertNotEqual(response.context['user'].username, 'Gérard')



    def test_logout(self):
        """Assert that user correctly logged out."""
        self.test_create_user()
        login = self.client.login(username='john', password='tata')
        self.assertEqual(login, True)

        response = self.client.get('/logout/',
                HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                follow=True
        )

        # assert user is logged out
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.context['user'].username, 'john')
        self.assertEqual(response.templates[0].name, 'user/user_login.html')



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
            },
            #HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
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

            },
            #HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
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
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')

        # assert user has been created in db
        user = User.objects.get(username='toto')
        
        # assert user is logged in
        self.assertEqual(response.context['user'].username, 'toto')



    def test_user_registration_fail(self):
        """Assert that user is nor created nor logged in with
        wrong parameters.
        """
        ## test that it's not possible to have differents
        ## password and confirmation password
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password1': 'kirikiki',
            'password2': 'kirikiko',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')


        ## test that it's not possible to have a
        ## not valid email
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')
        
        ## test that it's not possible to have no mail
        response = self.client.post('/register/', {
            'username': 'toto',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')
        
        ## test that it's not possible to have no username
        response = self.client.post('/register/', {
            'email': 'toto@toto.com',
            'password1': 'kirikiki',
            'password2': 'kirikiki',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')



        ## test that it's not possible to have only
        ## confirmation password
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password2': 'kirikiko',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')


        ## test that it's not possible to have no
        ## confirmation password
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            'password1': 'kirikiko',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')


        ## test that it's not possible to have no passwords
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@tata.com',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')


        ## test that it's not possible to have empty strings
        ## as passwords
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@toto.com',
            'password1': '',
            'password2': '',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 0)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')

        ## Test that it's not possible to have to user with
        ## same username

        # create a 'toto' user
        self.test_user_registration()

        # try to create second 'toto' user
        response = self.client.post('/register/', {
            'username': 'toto',
            'email': 'toto@titi.com',
            'password1': 'taratata',
            'password2': 'taratata',
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
            follow=True
        )

        # assert user has not been created in db
        user = User.objects.filter(username='toto').count()
        self.assertEqual(user, 1)

        # assert user has not been logged in
        self.assertNotEqual(response.context['user'], 'toto')

        # assert redirection is correct
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name,
                'user/user_registration.html')


