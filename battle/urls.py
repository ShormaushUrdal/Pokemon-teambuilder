from django.urls import path
from django.contrib import admin 
from .views import battle

urlpatterns = [
    path('', battle , name = 'battle_home'),
]
