#-*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render
from datetime import datetime
from conf.models import Conf, Page

# home page view
def home(request):
	return render(request, 'home.html', {
            'conf': Conf.objects.latest('date'), 
            'menu': Page.objects.filter(is_in_home_menu=True).order_by('position_in_home_menu', 'pk'), 
            'page': Page.objects.get(name='home')
            })

