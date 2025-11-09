from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, StudentDashboardView, InstructorDashboardView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('student/', StudentDashboardView.as_view(), name='student_dashboard'),
    path('instructor/', InstructorDashboardView.as_view(), name='instructor_dashboard'),
]