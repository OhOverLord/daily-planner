from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.shortcuts import render, redirect

# Create your views here.
from django.utils.decorators import method_decorator
from django.views.generic import FormView
from django.views.generic.base import View, TemplateView
from .forms import *


@method_decorator(login_required, name='dispatch')
class Index(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_account = User.objects.get(username=self.request.user)
        context = {
            'title': 'Overlord - daily planner',
            'user': current_account,
        }
        return context


class LoginFormView(FormView):
    template_name = 'login.html'
    form_class = AuthenticationForm
    success_url = '/'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('/')
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = {
            'loginform': LoginForm()
        }
        return context

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        if self.request.method == 'POST' and self.request.POST.get('remember_me', None):
            one_month_to_sec = 60 * 60 * 24 * 30
            self.request.session.set_expiry(one_month_to_sec)
        return super().form_valid(form)


class LogoutView(View):
    def get(self, request):
        logout(request)
        one_hour_to_sec = 60 * 60
        self.request.session.set_expiry(one_hour_to_sec)
        return redirect('/')
