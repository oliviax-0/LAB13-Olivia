from rest_framework import generics,permissions
from .serializers import RegisterSerializer,CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset= User.objects.all()
    permission_classes= (permissions.AllowAny,)
    serializer_class= RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class= CustomTokenObtainPairSerializer