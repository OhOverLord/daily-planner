from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=40,
        required=True,
        widget=forms.TextInput()
    )

    password = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.PasswordInput()
    )
