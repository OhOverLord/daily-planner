from django.contrib.auth.models import User
from django.db import models


class Record(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default='')
    creation_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField()
