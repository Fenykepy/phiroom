#-*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render, redirect
from datetime import datetime
from conf.models import Conf, Page

# home page view
def home(request):
    conf = Conf.objects.latest('date')

    # if default home page is used
    if conf.home_page.name == "home":
        return render(request, 'home.html', {
            'conf': conf, 
            'menu': Page.objects.filter(is_in_home_menu=True).order_by('position_in_home_menu', 'pk'), 
            'page': Page.objects.get(name='home')
            })
    # else redirect to custom home page
    else:
        return redirect(conf.home_page.reverse_url)
        

