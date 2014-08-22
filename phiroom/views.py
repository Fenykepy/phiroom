#-*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render, redirect
from datetime import datetime

from phiroom.settings import PHIROOM
from conf.models import Conf, Page

# home page view
def home(request):
    conf = Conf.objects.values(
            'title_home',
            'title',
            'sub_title_home',
            'home_logo',
            'home_page__reverse_url',
        ).latest()


    # if default home page is used
    if conf['home_page__reverse_url'] == "home":
        return render(request, 'home.html', {
            'conf': conf, 
            'menu': Page.home_menu.all(), 
            'page': Page.info.get(name='home'),
        })
    # else redirect to custom home page
    else:
        return redirect(conf['home_page__reverse_url'])



def get_error_context():
    """Return a dictionnary with context for error pages."""

    conf = Conf.objects.latest()
    page_name = 'home'

    return {
            'conf': conf,
            'menu': Page.main_menu.all(),
            'phiroom': PHIROOM,
            'page_info': Page.info.get(name=page_name)
            }




# 404 error page view
def error404(request):
    return render(request, 'errors/error_404.html', get_error_context())


# 500 error page view
def error500(request):
    return render(request, 'errors/error_500.html', get_error_context())



# 403 error page view
def error403(request):
    return render(request, 'errors/error_403.html', get_error_context())



# 400 error page view
def error400(request):
    return render(request, 'errors/error_400.html', get_error_context())


