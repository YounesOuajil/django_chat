# Generated by Django 5.0.4 on 2024-04-24 08:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0012_recruiter_company'),
        ('posts', '0005_remove_post_recruiter'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='recruiter',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='authentication.recruiter'),
            preserve_default=False,
        ),
    ]
