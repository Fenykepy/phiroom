# Phiroom, the cms for photographers

## Install

### Install Dependencies ###

On a debian like system, run as root:

    # apt-get update
    # apt-get safe-upgrade
    # apt-get install python3 python3-pip python3-setuptools libpng12-dev libjpeg8-dev exempi git python3-virtualenv libmagickwand-dev nodejs npm

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
    $ cd phiroom/src/api
    $ git checkout master
    $ pip3 install -r requirements.txt
    $ cd ../../
    $ npm install


### Quick install for testing or development ###

__!!! DO NOT USE THESE INSTRUCTIONS IN PRODUCTION !!!__

Use these instructions if you plan to use phiroom in local
for testing it or to develop it.

#### Set up database ####

Run as root:

    # apt-get install python-sqlite

Run as `<my_user>` (replace `<my_user>` by your user name):

    $ cd /var/www/phiroom_env/phiroom/src/api
    $ python3 manage.py migrate
    $ python3 manage.py createsuperuser
    $ python3 manage.py loaddata initial_data

 * Answer questions to create a superuser.

#### to run unit tests ####

    $ python3 manage.py test


#### Launch development server ####

Run as `<my_user>`:

    $ cd /var/www/phiroom_env/phiroom/src/api
    $ python3 manage.py runserver
    $ cd /var/www/phiroom_phiroom/phiroom
    $ npm start

 * You can use this instead if you want to access from different hosts:

        $ python3 manage.py runserver 0.0.0.0:8000

Open http://127.0.0.1:3000 in your favorite browser.




### Install for production ###

If you plan to use phiroom in local for testing it
or to develop it, go to **"Quick install for testing or development"**


#### Set up database ####

Run as root:

    # aptitude install postgresql postgresql-contrib python3-postgresql libpq-dev python-dev
    # pip3 install psycopg2
    # su - postgres
    postgres@server:~$ createdb phiroom
    postgres@server:~$ createuser -P
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
    
#### Configure Django app ####

Run as `<my_user>`:

 * Copy and complete as follow `phiroom/prod_settings.py.example`:
        
        $ cd /var/www/phiroom_env/phiroom/src/api
        $ cp phiroom/prod_settings.py.example phiroom/prod_settings.py
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

 * Edit `phiroom/local_settings.py`:

        $ vim phiroom/local_settings.py

 * Change it's content for:

        #from phiroom.devel_settings import *
        from phiroom.prod_settings import *

 * Now create tables:

        $ python3 manage.py migrate

 * Create a superuser:

        $ python3 manage.py createsuperuser

 * Collect static files:

        $ python3 manage.py collectstatic

 * Load initial datas:

        $ python3 manage.py loaddata initial_data

    
#### Configure Node app ####

Run as `<my_user>`:

        $ cd /var/www/phiroom_env/phiroom/src/js


 * Edit `config.js`:

        $ vim config.js

 * Set up base url (replace `phiroom.org` by your domain):

        let base_url = 'http://phiroom.org'

 * Tell node app to do not serve static files:

        let statics_proxy = true

 * Configure unix socket for connection with nginx:

        let port = '/var/www/phiroom_env/run/node.sock'

 * Save and quit.
    
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
        DJANGODIR=/var/www/phiroom_env/phiroom/src/api  # Django project directory
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
        source ../../../bin/activate
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
 * Quit python virtual environment with `deactivate`

#### Set up node app ####

 * Create a shell script to launch node app :

        $ vim /var/www/phiroom_env/bin/node_start

 * Complete it as follow:

        #!/bin/bash

        # go to app root directory
        cd /var/www/phiroom_env/phiroom

        # launch node
        npm run build
        npm run start_prod


 * Give execution rights to our script:

        $ sudo chmod u+x /var/www/phiroom_env/bin/node_start

 * You can test script running it as `<my_user>`:

        # su <my_user>
        <my_user>$ /var/www/phiroom_env/bin/node_start
 
 * Quit with `ctrl+C`

#### Customize styles ####

##### Header styles ####

You can customize headers CSS easily (and other less files carrefully):

        $ cd /var/www/phiroom_env/phiroom

 * Make a backup:

        $ cp src/less/common/header.less src/less/common/header.default.less

 * Edit `src/less/common/header.less`:

        $ vim src/less/common/header.less

 * You can found a list of all default theme colors variables in `src/less/common/palette.less`, feel free to use them

##### Change color theme #####

You can customise color theme:

        $ cd /var/www/phiroom_env/phiroom

 * Make a backup:
        
        $ cp src/less/common/palette.less src/less/common/palette.default.less

 * Edit `src/less/common/palette.less`:

        $ vim src/less/common/palette.less

##### Make a build after any style changement #####

After any style changement you need to make a new build an relaunch node app:

        $ cd /var/www/phiroom_env/phiroom
        $ npm run build

 * When it's done restart node app (see Monitoring App section).

#### Monitoring our App ####

I'll present here two solution for monitoring our app :
 * First using supervisor
 * Second using systemd, if it's available on your system


##### Monitoring App with supervisor #####

###### Gunicorn ######

Run as root:

    # aptitude install supervisor

 * Create configuration file for gunicorn:

        # vim /etc/supervisor/conf.d/phiroom_gunicorn.conf

 * Complete it as follow:

        [program:phiroom]
        command = /var/www/phiroom_env/bin/gunicorn_start
        user = <my_user>
        autostart = true
        autorestart = true
        stdout_logfile = /var/www/phiroom_env/bin/phiroom_gunicorn_supervisor.log
        redirect_stderr = true

 * Now you can manage gunicorn with following commands:

        # supervisorctl status phiroom_gunicorn
        # supervisorctl stop phiroom_gunicorn
        # supervisorctl start phiroom_gunicorn
        # supervisorctl restart phiroom_gunicorn

##### Node #####

 * Create configuration file for node:

        # vim /etc/supervisor/conf.d/phiroom_node.conf

 * Complete it as follow:

        [program:phiroom]
        command = /var/www/phiroom_env/bin/node_start
        user = <my_user>
        autostart = true
        autorestart = true
        stdout_logfile = /var/www/phiroom_env/bin/phiroom_node_supervisor.log
        redirect_stderr = true

 * Now you can manage gunicorn with following commands:

        # supervisorctl status phiroom_node
        # supervisorctl stop phiroom_node
        # supervisorctl start phiroom_node
        # supervisorctl restart phiroom_node


##### Set up supervisor #####

 * Edit configuration file:

        # vim /etc/supervisor/supervisord.conf

 * Add or change these lines (according to your locale):

        [supervisord]
        environment = LANG=fr_FR.UTF-8, LC_ALL=fr_FR.UTF-8, LC_LANG=fr_FR.UTF-8

 * Relaunch supervisor:

        # supervisorctl reread
        # supervisorctl update



##### Monitoring App with systemd #####

##### Gunicorn #####

Run as root :
 * Create configuration file for gunicorn:

        # vim /etc/systemd/system/phiroom_gunicorn.service

 * Complete it as follow:

    [Unit]
    Description=Phiroom_gunicorn
    After=network.target

    [Service]
    User=<my_user>
    Group=<my_group>
    WorkingDirectory=/var/www/phiroom_env/phiroom
    ExecStart=/var/www/phiroom_env/bin/gunicorn_start

    [Install]
    WantedBy=multi-user.target

 * We start service and enable it as boot:

        # systemctl start phiroom_gunicorn
        # systemctl enable phiroom_gunicorn

 * Now we can manage our API with following commands:

        # systemctl start phiroom_gunicorn
        # systemctl status phiroom_gunicorn
        # systemctl stop phiroom_gunicorn
        # systemctl restart phiroom_gunicorn

##### Node #####

Run as root :
 * Create configuration file for node:

        # vim /etc/systemd/system/phiroom_node.service

 * Complete it as follow:

    [Unit]
    Description=Phiroom_node
    After=network.target

    [Service]
    User=<my_user>
    Group=<my_group>
    WorkingDirectory=/var/www/phiroom_env/phiroom
    ExecStart=/var/www/phiroom_env/bin/node_start

    [Install]
    WantedBy=multi-user.target

 * We start service and enable it as boot:

        # systemctl start phiroom_node
        # systemctl enable phiroom_node

 * Now we can manage our API with following commands:

        # systemctl start phiroom_node
        # systemctl status phiroom_node
        # systemctl stop phiroom_node
        # systemctl restart phiroom_node


#### Set up nginx ####

Run as root:

    # aptitude install nginx

 * Create new nginx configuration file:

        # vim /etc/nginx/sites-available/phiroom

 * Complete it as follow (this is just a basic example, and it's not secured at all. You should read nginx documentation to set it up correctly for your real production environment):

        upstream phiroom_api_server {
            # fail_timeout=0 means we always retry an upstream even if it failed
            # te return a good HTTP response (in case the Unicorn master nukes a
            # single worker for timing out).
            server unix:/var/www/phiroom_env/run/gunicorn.sock fail_timeout=0
        }


        upstream phiroom_node_server {
            # fail_timeout=0 means we always retry an upstream even if it failed
            # te return a good HTTP response (in case the Unicorn master nukes a
            # single worker for timing out).
            server unix:/var/www/phiroom_env/run/node.sock fail_timeout=0
        }

        server {
            listen 80;
            server_name phiroom.org;

            root /var/www/phiroom_env/phiroom/phiroom;

            if ($host = 'www.phiroom.org'){
                rewrite ^/(.*)$ http://phiroom.org/$1 permanent;
            }

            client_max_body_size 4G;
            access_log /var/log/nginx/phiroom-access.log;
            error_log /var/log/nginx/phiroom-error.log;

            location /assets/ {
                alias /var/www/phiroom_env/phiroom/src/api/phiroom/assets/;
            }

            location /media/ {
                alias /var/www/phiroom_env/phiroom/src/api/phiroom/data/;
                # static content, we cache for one year
                add_header Cache-Control max-age=31536000;
            }

            location /statics/ {
                alias /var/www/phiroom_env/phiroom/dist;
                # static content, we cache for one year
                add_header Cache-Control max-age=31536000;
            }

            location / {
                # mutable content, cache always must revalidate
                add_header Cache-Control no-cache;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_read_timeout 300000;
                proxy_redirect off;
                proxy_set_header REMOTE_ADDR $remote_addr;
                proxy_set_header X-Real-IP $remote_addr;
                if (!-f $request_filename) {
                    proxy_pass http://phiroom_node_server;
                    break;
                }
            }

            location /api/ {
                # mutable content, cache always must revalidate
                add_header Cache-Control no-cache;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_read_timeout 300000;
                proxy_redirect off;
                proxy_set_header REMOTE_ADDR $remote_addr;
                proxy_set_header X-Real-IP $remote_addr;
                if (!-f $request_filename) {
                    proxy_pass http://phiroom_api_server;
                    break;
                }
            }
        }

 * Enable new configuration file:

        # ln -s /etc/nginx/sites-available/phiroom /etc/nginx/sites-enabled/phiroom

 * Restart nginx:

        # /etc/init.d/nginx restart

Open http://phiroom.org (replacing `phiroom.org` by your domain, here and in each configuration files) in your favorite browser.
