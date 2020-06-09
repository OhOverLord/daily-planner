from django.shortcuts import render

# Create your views here.
from django.views.generic.base import View


class Index(View):
    template = 'index.html'

    def get(self, request):
        context = {
            "hello": "Hello world"
        }
        return render(request, self.template, context)