# Generated by Django 5.0.4 on 2024-04-30 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utils', '0004_remove_internship_interns_internship_interns'),
    ]

    operations = [
        migrations.AlterField(
            model_name='internship',
            name='interns',
            field=models.ManyToManyField(null=True, related_name='internships', to='utils.intern'),
        ),
    ]
