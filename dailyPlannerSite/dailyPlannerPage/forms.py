from django import forms
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
