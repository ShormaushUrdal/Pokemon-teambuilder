from django.contrib import admin
from django.urls import path, include
from teambuilder.views import teambuilder, dashboard
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('battle.urls')),  
    path('teambuilder/', include('teambuilder.urls')),
    path('accounts/', include('allauth.urls')),  
    path('dashboard/', dashboard, name='dashboard'),
    path("_allauth/", include("allauth.headless.urls")),
]

if(settings.DEBUG):
    urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)