# Generated by Django 3.0.7 on 2020-06-14 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dailyPlannerPage', '0002_auto_20200613_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='record',
            name='status',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
