from django.urls import path
from .views import *


urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('login/', LoginFormView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('add_record/', AddRecord.as_view(), name='add_record'),
    path('record_status/', RecordStatus.as_view(), name='record_status'),
    path('registration/', RegisterFormView.as_view(), name='registration'),
]
