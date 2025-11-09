
from django.contrib.auth import get_user_model
from rest_framework import generics,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Grade, CustomUser
from .serializers import GradeSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    GradeSerializer,
)
from .models import Course, Grade

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class StudentDashboardView(generics.GenericAPIView):
    """Dashboard student - AllowAny"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # ✅ Ambil email dari query params
        user_email = request.query_params.get('email')
        
        print(f"📥 Received email: {user_email}")  # Debug
        
        if not user_email:
            return Response({'error': 'Email parameter required'}, status=400)
        
        try:
            user = User.objects.get(email=user_email, role='student')
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)
        
        # Get grades
        grades = Grade.objects.filter(
            student=user,
        ).select_related('course', 'course__instructor')
        
        print(f"📊 Found {grades.count()} grades")  # Debug
        
        total_points = 0
        total_credits = 0
        
        for grade in grades.filter(letter_grade__isnull=False):
            gp = grade.get_grade_point()
            credits = grade.course.credits
            total_points += gp * credits
            total_credits += credits
        
        gpa = round(total_points / total_credits, 2) if total_credits > 0 else 0.0
        
        return Response({
            'student': {
                'name': user.full_name,
                'email': user.email,
                'major': user.major,
            },
            'statistics': {
                'total_courses': grades.count(),
                'gpa': gpa,
                'total_credits': total_credits,
            },
            'grades': GradeSerializer(grades, many=True).data
        })

class InstructorDashboardView(APIView):
    """
    Dashboard Instructor
    - Hanya bisa diakses oleh user dengan role 'instructor'
    - Email wajib menggunakan domain @prasetiyamulya.ac.id
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Ambil parameter email dari query
        email = request.query_params.get("email")

        if not email:
            return Response({"error": "Email diperlukan."}, status=400)

        # ✅ Validasi domain email
        if not email.endswith("@prasetiyamulya.ac.id"):
            return Response(
                {"error": "Akses ditolak. Hanya email @prasetiyamulya.ac.id yang diizinkan."},
                status=403,
            )

        # ✅ Cari user dengan role 'instructor' dan email yang cocok
        try:
            instructor = CustomUser.objects.get(email=email, role="instructor")
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Instructor dengan email tersebut tidak ditemukan atau tidak memiliki role instructor."},
                status=404,
            )

        # ✅ Ambil semua course yang diajar oleh instructor ini
        courses = Course.objects.filter(instructor=instructor)

        course_data = []
        for course in courses:
            grades = Grade.objects.filter(course=course).select_related("student")
            grade_data = GradeSerializer(grades, many=True).data

            course_data.append({
                "name": course.name,
                "code": course.code,
                "credits": course.credits,
                "semester": course.semester,
                "grades": grade_data,
            })

        # ✅ Return data dashboard
        return Response({
            "instructor": {
                "full_name": instructor.full_name,
                "email": instructor.email,
                "major": instructor.major,
            },
            "courses": course_data,
        }, status=200)
