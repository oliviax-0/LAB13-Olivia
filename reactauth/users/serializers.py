from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Grade
import re

User = get_user_model()

# ============= AUTHENTICATION (tetap perlu) =============

class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['email','username','full_name', 'major', 'role','password','password_confirmation']
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major':{'required':True},
        }

    def validate_email(self, value):
        email = value.lower()
        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac\.id')
        instructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac\.id')

        if student_pattern.match(email) or instructor_pattern.match(email):
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already in use.")
            return email
        
        raise serializers.ValidationError("Email must be a valid student or instructor email address.")
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        email = validated_data['email'].lower()
        username = email.split('@')[0]
        domain = email.split('@')[1]

        role = ""
        if domain == 'student.prasetiyamulya.ac.id':
            role = 'student'
        elif domain == 'prasetiyamulya.ac.id':
            role = 'instructor'
        
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            major=validated_data.get('major',''),
            role=role
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate_email(self, value):
        return value.lower()
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['full_name'] = user.full_name
        token['major'] = user.major
        token['role'] = user.role
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        token_data = {
            'access': data['access'],
            'refresh': data['refresh'],
        }
        
        data.update({
            'email': self.user.email,
            'username': self.user.username,
            'full_name': self.user.full_name,
            'major': self.user.major,
            'role': self.user.role,
            'token': token_data,
        })
        return data


class GradeSerializer(serializers.ModelSerializer):
    """Serializer untuk display grade (READ ONLY)"""
    
    # Gunakan SerializerMethodField untuk semua relasi yang bisa None
    student_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    course_code = serializers.SerializerMethodField()
    course_credits = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    grade_point = serializers.SerializerMethodField()
    
    class Meta:
        model = Grade
        fields = [
            'id',
            'course_code', 'course_name', 'course_credits',
            'instructor_name', 'student_name',
            'assignment_score', 'midterm_score', 'final_score',
            'final_grade', 'letter_grade', 'grade_point',
            'created_at'
        ]
    
    def get_student_name(self, obj):
        return obj.student.full_name if obj.student else None
    
    def get_course_name(self, obj):
        return obj.course.name if obj.course else None
    
    def get_course_code(self, obj):
        return obj.course.code if obj.course else None
    
    def get_course_credits(self, obj):
        return obj.course.credits if obj.course else None
    
    def get_instructor_name(self, obj):
        """Handle case ketika instructor bisa None"""
        if obj.course and obj.course.instructor:
            return obj.course.instructor.full_name
        return None
    
    def get_grade_point(self, obj):
        return obj.get_grade_point() if obj.letter_grade else None
    


