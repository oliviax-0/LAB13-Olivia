from django.contrib import admin
from .models import CustomUser, Course, Grade

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'role', 'major']
    list_filter = ['role', 'major']
    search_fields = ['email', 'full_name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'semester', 'credits', 'major', 'instructor']
    list_filter = ['semester', 'major', 'credits']
    search_fields = ['code', 'name']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('instructor')

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = [
        'student', 
        'course', 
        'assignment_score', 
        'midterm_score', 
        'final_score',
        'final_grade',
        'letter_grade',
        # ❌ HAPUS 'is_active' - field ini sudah tidak ada!
    ]
    
    list_filter = [
        'letter_grade',
        'course__semester',
        # ❌ HAPUS 'is_active'
    ]
    
    list_editable = [
        'assignment_score',
        'midterm_score',
        'final_score',
        # ❌ HAPUS 'is_active'
    ]
    
    search_fields = [
        'student__full_name',
        'student__email',
        'course__code',
        'course__name'
    ]
    
    readonly_fields = ['final_grade', 'letter_grade', 'created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('student', 'course')