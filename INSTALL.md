phiroom
=======

cms for photographers

Install
-------

### Install Dependencies ###

On a debian like system, run as root:

    # apt-get update
    # apt-get safe-upgrade
    # apt-get install python3 python3-markdown python3-pip python3-yaml python3-setuptools libpng12-dev libjpeg8-dev exempi git python3-virtualenv libmagickwand-dev

### Set environement up ###

Run as root:

    # mkdir -p /var/www/phiroom_env
    # chown <my_user> /var/www/phiroom_env

Run as `<my_user>`:

    $ cd /var/www/phiroom_env
    $ virtualenv .

    New python executable in phiroom_env/bin/python
    Installing distribute..............done.
    Installing pip.....................done.

    $ source bin/activate
    $ git clone https://github.com/Fenykepy/phiroom.git
    $ cd phiroom
    $ git checkout master
    $ pip3 install -r requirements.txt
    $ npm install
    $ bower install


### Quick install for testing or development ###

__!!! DO NOT USE THESE INSTRUCTIONS IN PRODUCTION !!!__

Use these instructions if you plan to use phiroom in local
for testing it or to develop it.

#### Set up database ####

Run as root:

    # apt-get install python-sqlite

Run as `<my_user>` (replace `<my_user>` by your user name):

    $ cd /var/www/phiroom/
    $ python3 manage.py migrate
    $ python3 manage.py createsuperuser

 * Answer questions to create a superuser.

#### to run unit tests ####

    $ pip3 manage.py test


#### Launch development server ####

Run as `<my_user>`:

    $ cd /var/www/phiroom/
    $ python3 manage.py runserver

 * You can use this instead if you want to access from different hosts:

        $python3 manage.py runserver 0.0.0.0:8000

Open http://127.0.0.1:8000 in your favorite browser.




### Install for production ###

If you plan to use phiroom in local for testing it
or to develop it, go to **"Quick install for testing or development"**


#### Set up database ####

Run as root:

    # aptitude install postgresql postgresql-contrib python3-postgresql libpq-dev python-dev
    # pip3 install psycopg2
    # su - postgres
    postgres@server:~$ createdb phiroom
    postgres@server:~$ createuser --interactive -P
    Saisir le nom du rôle à ajouter : phiroom
    Saisir le mot de passe pour le nouveau rôle : 
    Le saisir de nouveau : 
    Le nouveau rôle est-il super-utilisateur ? (o/n) n
    Le nouveau rôle est-il autorisé à créer des bases de données ? (o/n) n
    Le nouveau rôle est-il autorisé à créer de nouveaux rôles ? (o/n) n

    postgres@server:~$ psql
    psql (9.1.9)
    Type "help" for help.

    postgres=# GRANT ALL PRIVILEGES ON DATABASE phiroom TO phiroom;
    GRANT
    postgres=# \q
    postgres@server:~$ logout

Fix those options in `/etc/postgresql/9.1/main/postgresql.conf`:

     # vim /etc/postgresql/9.1/main/postgresql.conf

     #----------------------
     # DJANGO CONFIGURATION
     #----------------------

     client_encoding = 'UTF8'
     default_transaction_isolation = 'read committed'
     timezone = 'UTC'

Fix those options in `/etc/postgresql/9.4/main/pg_hba.conf`:

     # vim /etc/postgresql/9.4/main/pg_hba.conf

     local   all             all                                     trust
     host    all             all             127.0.0.1/32            trust


Relaunch postgresql:

    # /etc/init.d/postgresql restart

Run as `<my_user>`:

 * Rename and complete as follow `phiroom/prod_settings.py.example`:

        $ mv phiroom/prod_settings.py.example phiroom/prod_settings.py
        $ vim phiroom/prod_settings.py

 * Change for your name and mail:

        ADMINS = (
            # ('Your Name', 'your_email@example.com'),
            ('Lavilotte-Rolle Frédéric', 'pro@lavilotte-rolle.fr'),
        )

 * Change default from email:

        DEFAULT_FROM_EMAIL = 'pro@lavilotte-rolle.fr'

 * Change `PASSWORD` for database, `NAME` and `USER` too if needed:

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
                'NAME': 'phiroom',
                # The following settings are not used with sqlite3:
                'USER': 'phiroom',
                'PASSWORD': 'my_wonderful_db_password',
                'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
                'PORT': '',                      # Set to empty string for default.
            }
        }

 * Change `SECRET_KEY` for a new strong one:

        # Make this unique, and don't share it with anybody.
        SECRET_KEY = '#v04u18pw)rsgry7fhw*7)t0^)nm!l6fod90fb7y8ckbu0u8yx'

 * Change `ALLOWED_HOSTS` for your own domains:

        ALLOWED_HOSTS = ['phiroom.org', 'www.phiroom.org']

 * You can also change `TIME_ZONE` and `LANGUAGE_CODE` if necessary.

 * Edit `phiroom/local_settings.py` :

        $ vim phiroom/local_settings.py

 * Change it's content for :

        #from phiroom.devel_settings import *
        from phiroom.prod_settings import *

 * Now create tables:

        $ python3 manage.py migrate

 * Create a superuser:

        $ python3 manage.py createsuperuser


#### Set up gunicorn ####

Run as root:

    # pip3 install gunicorn

 * You can test that it runs correctly with following command (to run as `<my_user>` before going further:

        $ gunicorn phiroom.wsgi:application --bind example.com:8001

 * Replace `example.com` by your hostname.
 * You should now be able to access the Gunicorn server from http://example.com:8001

 * Create a shell script to launch gunicorn with some parameters:

        $ vim /var/www/phiroom_env/bin/gunicorn_start

 * Complete it as follow:

        #!/bin/bash
        NAME="phiroom"                                  # Name of the application
        DJANGODIR=/var/www/phiroom_env/phiroom          # Django project directory
        SOCKFILE=/var/www/phiroom_env/run/gunicorn.sock # we will communicte using this unix socket
        USER=<my_user>                                  # the user to run as
        GROUP=<my_group>                                # the group to run as
        NUM_WORKERS=3                                   # how many worker processes should Gunicorn spawn
        DJANGO_SETTINGS_MODULE=phiroom.settings      # which settings file should Django use
        DJANGO_WSGI_MODULE=phiroom.wsgi              # WSGI module name
        TIMEOUT=300000
        ##
        echo "Starting $NAME as `whoami`"
        ## Activate the virtual environment
        cd $DJANGODIR
        source ../bin/activate
        export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
        export PYTHONPATH=$DJANGODIR:$PYTHONPATH

        ## Create the run directory if it doesn't exist
        RUNDIR=$(dirname $SOCKFILE)
        test -d $RUNDIR || mkdir -p $RUNDIR
        
        ## Start your Django Unicorn
        # Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
        exec gunicorn ${DJANGO_WSGI_MODULE}:application \
            --name $NAME \
            --workers $NUM_WORKERS \
            --user=$USER --group=$GROUP \
            --log-level=debug \
            --bind=unix:$SOCKFILE \
            --timeout $TIMEOUT \
            --graceful-timeout $TIMEOUT
        ## this script comes from: http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor/

 * Give execution rights to our script:

        $ sudo chmod u+x /var/www/phiroom_env/bin/gunicorn_start

 * You can test script running it as `<my_user>`:

        # su <my_user>
        <my_user>$ /var/www/phiroom_env/bin/gunicorn_start
 
 * Quit with `ctrl+C`


#### Set up supervisor ####

Run as root:

    # aptitude install supervisor

 * Create configuration file:

        # vim /etc/supervisor/conf.d/phiroom.conf

 * Complete it as follow:

        [program:phiroom]
        command = /var/www/phiroom_env/bin/gunicorn_start.bash
        user = <my_user>
        autostart = true
        autorestart = true
        stdout_logfile = /var/www/phiroom_env/bin/gunicorn_supervisor.log
        redirect_stderr = true

 * Edit configuration file:

        # vim /etc/supervisor/supervisord.conf

 * Add or change these lines (according to your locale):

        [supervisord]
        environment = LANG=fr_FR.UTF-8, LC_ALL=fr_FR.UTF-8, LC_LANG=fr_FR.UTF-8

 * Relaunch supervisor:

        # supervisorctl reread
        # supervisorctl update

 * Now you can manage supervisor with following commands:

        # supervisorctl status phiroom
        # supervisorctl stop phiroom
        # supervisorctl start phiroom
        # supervisorctl restart phiroom


#### Set up nginx ####

Run as root:

    # aptitude install nginx

 * Create new nginx configuration file:

        # vim /etc/nginx/sites-available/phiroom

 * Complete it as follow:

        upstream phiroom_app_server {
            # fail_timeout=0 means we always retry an upstream even if it failed
            # te return a good HTTP response (in case the Unicorn master nukes a
            # single worker for timing out).
            server unix:/var/www/phiroom_env/run/gunicorn.sock fail_timeout=0
        }


        server {
            listen 80 default;
            server_name phiroom.org;
            if ($host = 'www.phiroom.org'){
                rewrite ^/(.*)$ http://phiroom.org/$1 permanent;
            }
            client_max_body_size 4G;
            access_log /var/log/nginx/phiroom-access.log;
            error_log /var/log/nginx/phiroom-error.log;

            location /assets/ {
                alias /var/www/phiroom_env/phiroom/phiroom/statics/;
            }

            location /media/ {
                alias /var/www/phiroom_env/phiroom/phiroom/data/;
            }

            location / {
                alias /var/www/phiroom_env/phiroom/phiroom/statics/index.html;
            }

            location /api {
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_read_timeout 300000;
                proxy_redirect off;
                if (!-f $request_filename) {
                    proxy_pass http://phiroom_app_server;
                    break;
                }
            }
        }

 * Enable new configuration file:

        # ln -s /etc/nginx/sites-available/phiroom /etc/nginx/sites-enabled/phiroom

 * Restart nginx:

        # /etc/init.d/nginx restart

Open http://phiroom.org (replacing `phiroom.org` by your domain, here and in each configuration files) in your favorite browser.
