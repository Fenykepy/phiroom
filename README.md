phiroom
=======

cms for photographers

http://phiroom.org


Install
-------

### Install Dependencies ###

On a debian like system, run as root:

    # apt-get update
    # apt-get safe-upgrade
    # apt-get install python3 python3-markdown python3-pip python3-yaml python3-setuptools libpng12-dev libjpeg8-dev exempi git
    # pip3 install Django==1.6.5
    # pip3 install django-mptt
    # pip3 install Pillow==2.5.3
    # pip3 install pytz
    # pip3 install python-xmp-toolkit==2.0.1

### Get sources ###

Run as root:

    # mkdir /var/www
    # cd /var/www
    # git clone https://github.com/Fenykepy/phiroom.git
    # chown -r phiroom <my_user>:<my_user>



### Quick install for testing or development ###

!!! Do Not Use These Instructions On Production !!!

Use these instructions if you plan to use phiroom in local
for testing it or to develop it.


#### Set up database ####

Run as root:

    # aptitude install python-sqlite

Run as `<my_user>`:

    $ cd /var/www/phiroom/
    $ python3 manage.py syncdb

 * Answer questions to create a superuser.


#### Launch development server ####

Run as `<my_user>`:

    $ cd /var/www/phiroom/
    $ python3 manage.py runserver

 * You can use this instead if you want to access from different hosts:

    $ python3 manage.py runserver 0.0.0.0:8000

 * Open http://127.0.0.1:8000 in your favorite browser.





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
    Enter name of role to add: phiroom
    Enter password for new role:
    Shall the new role be a superuser? (y/n) n
    Shall the new role be allowed to create databases? (y/n) n
    Shall the new role be allowed to create more new roles? (y/n) n
    postgres@server:~$ psql
    psql (9.1.9)
    Type "help" for help.

    postgres=# GRANT ALL PRIVILEGES ON DATABASE phiroom TO phiroom;
    GRANT
    postgres=# \q
    postgres@server:~$ logout

 * Fix those options in `/etc/postgresql/9.1/main/postgresql.conf`:


    # vim /etc/postgresql/9.1/main/postgresql.conf

    #----------------------
    # DJANGO CONFIGURATION
    #----------------------

    client_encoding = 'UTF8'
    default_transaction_isolation = 'read committed'
    timezone = 'UTC'

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

 * Edit `phiroom/local_settings.py` as follow:

    $ vim phiroom/local_settings.py

    #from phiroom.devel_settings import *
    from phiroom.prod_settings import *

 * Now create tables:

    $ python3 manage.py syncdb

 * Answer questions to create a superuser.


#### Set up gunicorn ####

Run as root:

    # pip3 install gunicorn==18

 * You can test that it runs correctly with following command (to run as `<my_user>` before going further:

    $ gunicorn hello.wsgi:application --bind example.com:8001

 * Replace `example.com` by your hostname.
 * You should now be able to access the Gunicorn server from http://example.com:8001

 * Create a shell script to launch gunicorn with some parameters:

    $ mkdir ~/scripts
    $ vim ~/scripts/gunicorn_start.bash

    #!/bin/bash

    NAME="phiroom"                               # Name of the application
    DJANGODIR=/var/www/phiroom                   # Django project directory
    SOCKFILE=/var/www/phiroom/run/gunicorn.sock  # we will communicte using this unix socket
    USER=<my_user>                               # the user to run as
    GROUP=<my_group>                             # the group to run as
    NUM_WORKERS=3                                # how many worker processes should Gunicorn spawn
    DJANGO_SETTINGS_MODULE=phiroom.settings      # which settings file should Django use
    DJANGO_WSGI_MODULE=phiroom.wsgi              # WSGI module name
    TIMEOUT=300000

    echo "Starting $NAME as `whoami`"

    # Activate the virtual environment
    cd $DJANGODIR
    #source ../bin/activate
    export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
    export PYTHONPATH=$DJANGODIR:$PYTHONPATH

    # Create the run directory if it doesn't exist
    RUNDIR=$(dirname $SOCKFILE)
    test -d $RUNDIR || mkdir -p $RUNDIR

    # Start your Django Unicorn
    # Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
    exec gunicorn ${DJANGO_WSGI_MODULE}:application \
        --name $NAME \
        --workers $NUM_WORKERS \
        --user=$USER --group=$GROUP \
        --log-level=debug \
        --bind=unix:$SOCKFILE \
        --timeout $TIMEOUT \
        --graceful-timeout $TIMEOUT

    # this script comes from: http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor/

 * Give execution rights to our script:

    $ sudo chmod u+x ~/scripts/gunicorn_start.bash

 * You can test script running it as `<my_user>`:

    # su <my_user>
    <my_user>$ ~/scripts/gunicorn_start.bash
 
 * Quit with `ctrl+C`


#### Set up supervisor ####

Run as root:

    # aptitude install supervisor

 * Create and complete configuration file:

    # vim /etc/supervisor/conf.d/phiroom.conf

    [program:phiroom]
    command = /home/<my_user>/scripts/gunicorn_start.bash
    user = <my_user>
    autostart = true
    autorestart = true
    stdout_logfile = /var/log/supervisor/phiroom.log
    redirect_stderr = true

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

 * Configure nginx:

    # vim /etc/nginx/sites-available/phiroom

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
            alias /var/www/phiroom/phiroom/assets/;
        }

        location /data/ {
            alias /var/www/phiroom/phiroom/data/;
        }

        location / {
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

    # ln -s /etc/nginx/sites-available/phiroom /etc/nginx/sites-enabled/phiroom
    # /etc/init.d/nginx restart
