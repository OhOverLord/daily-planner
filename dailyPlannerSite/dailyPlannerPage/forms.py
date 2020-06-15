from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from .models import Record


class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=40,
        required=True,
        widget=forms.TextInput(attrs={'name': 'username', 'class': 'form-control'})
    )

    password = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.PasswordInput(attrs={'name': 'password', 'class': 'form-control'})
    )


class RecordForm(forms.ModelForm):
    class Meta:
        model = Record
        fields = ['title', 'completion_date']

        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'name': 'title'}),
            'completion_date': forms.DateInput(attrs={'class': 'form-control', 'name': 'creation_date',
                                                      'type': 'date'}),
        }

        labels = {
            'title': 'Название',
            'completion_date': 'Дата выполнения',
        }


class RegisterForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        fields = (
            User.USERNAME_FIELD,
            User.EMAIL_FIELD,
            'password1',
            'password2',
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.email = forms.CharField(
            label=_('Email'),
            strip=False,
            widget=forms.EmailInput,
            help_text=_('Enter your email.'),
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
