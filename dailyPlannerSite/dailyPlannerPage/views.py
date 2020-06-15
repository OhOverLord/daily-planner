import datetime

from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.utils.decorators import method_decorator
from django.views.generic import FormView
from django.views.generic.base import View, TemplateView
from .forms import *


@method_decorator(login_required, name='dispatch')
class Index(TemplateView):
    template_name = 'index.html'
    current_account = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.current_account = User.objects.get(username=self.request.user)
        context = {
            'title': ' - daily planner',
            'user': self.current_account,
            'record_form': RecordForm()
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


class RegisterFormView(FormView):
    template_name = 'registration.html'
    form_class = RegisterForm
    success_url = '/daily_planner/login/'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('/')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        if form.is_valid:
            form.save()
            return super().form_valid(form)
        return redirect('register')


class AddRecord(View):
    def get(self, request):
        data = request.GET.get("data", "")
        current_user = User.objects.get(username=request.user)
        return HttpResponse(serializers.serialize('json', current_user.record_set.filter(completion_date=data))
                            , content_type='application/json')

    def post(self, request):
        record_form = RecordForm(request.POST)
        current_user = request.user
        if record_form.is_valid():
            record = Record()
            record.user = current_user
            record.title = record_form.cleaned_data['title']
            record.completion_date = record_form.cleaned_data['completion_date']
            record.save()
        return redirect('/')


class RecordStatus(View):
    def get(self, request):
        current_user = User.objects.get(username=request.user)
        now = datetime.datetime.now()
        for el in current_user.record_set.all():
            if el.status != 'Выполненно':
                date = str(el.completion_date).split('-')
                if date[0] <= str(now.year) and date[1][1] <= str(now.month) and date[2] < str(now.day + 1):
                    print(el.completion_date)
                    el.status = 'Не выполнено'
                    el.save()
        return HttpResponse("True")