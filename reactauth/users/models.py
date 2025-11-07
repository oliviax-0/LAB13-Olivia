from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    ]
    MAJOR_CHOICES = [
        ('artificial_intelligence_and_robotics', 'AIR'),
        ('business_mathematics', 'BM'),
        ('digital_business_technology', 'DBT'),
        ('product_design_engineering', 'PDE'),
        ('food_business_technology', 'FBT'),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    major= models.CharField(max_length=100,choices=MAJOR_CHOICES,blank=True,null=True)
    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default='student')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','full_name']

    def __str__(self):
        return self.email


