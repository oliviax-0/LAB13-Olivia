from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


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


class Course(models.Model):
    """Model untuk menyimpan informasi mata kuliah"""
    SEMESTER_CHOICES = [
        ('1', 'Semester 1'),
        ('2', 'Semester 2'),
        ('3', 'Semester 3'),
        ('4', 'Semester 4'),
        ('5', 'Semester 5'),
        ('6', 'Semester 6'),
        ('7', 'Semester 7'),
        ('8', 'Semester 8'),
    ]
    CREDITS_CHOICES = [
        (2, '2 SKS'),
        (3, '3 SKS'),
        (4, '4 SKS'),
        (6, '6 SKS'),
    ]


    code = models.CharField(
        max_length=20,
        unique=True,
        help_text="Kode mata kuliah (misal: CS101)"
    )
    name = models.CharField(
        max_length=200,
        help_text="Nama mata kuliah"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Deskripsi mata kuliah"
    )
    credits = models.IntegerField(
    choices=CREDITS_CHOICES,
    help_text="Jumlah SKS"
    
    )
    semester = models.CharField(
        max_length=1,
        choices=SEMESTER_CHOICES,
        help_text="Semester"
    )
    major = models.CharField(
        max_length=100,
        choices=CustomUser.MAJOR_CHOICES,
        help_text="Program studi untuk mata kuliah ini"
    )
    instructor = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses_taught',
        limit_choices_to={'role': 'instructor'},
        help_text="Dosen pengampu"
    )
    
    # Relasi many-to-many langsung ke students melalui Grade
    students = models.ManyToManyField(
        CustomUser,
        through='Grade',
        related_name='enrolled_courses',
        limit_choices_to={'role': 'student'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['semester', 'code']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return f"{self.code} - {self.name}"

    def get_total_students(self):
        """Menghitung total mahasiswa yang terdaftar"""
        return self.grades.filter.count()

    def get_average_grade(self):
        """Menghitung rata-rata nilai kelas"""
        from django.db.models import Avg
        avg = self.grades.filter(
            final_grade__isnull=False,
        ).aggregate(avg_grade=Avg('final_grade'))
        return round(avg['avg_grade'], 2) if avg['avg_grade'] else None

class Grade(models.Model):
    """Model untuk nilai mahasiswa (sekaligus enrollment)"""
    
    # Grade choices & points
    GRADE_CHOICES = [
        ('A', 'A (4.0)'),
        ('A-', 'A- (3.7)'),
        ('B+', 'B+ (3.3)'),
        ('B', 'B (3.0)'),
        ('B-', 'B- (2.7)'),
        ('C+', 'C+ (2.3)'),
        ('C', 'C (2.0)'),
        ('D', 'D (1.0)'),
        ('E', 'E (0.0)'),
    ]

    GRADE_POINTS = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0.0,
    }

    # Relasi
    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='grades',
        limit_choices_to={'role': 'student'}
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='grades'
    )
    
    # Nilai
    assignment_score = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True, blank=True
    )
    midterm_score = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True, blank=True
    )
    final_score = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True, blank=True
    )
    
    # Nilai akhir
    final_grade = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True,
        editable=False
    )
    letter_grade = models.CharField(
        max_length=2,
        choices=GRADE_CHOICES,
        null=True, blank=True,
        editable=False
    )
    
    # ❌ HAPUS INI
    # is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-created_at']

    def __str__(self):
        grade = self.letter_grade or 'Belum dinilai'
        return f"{self.student.full_name} - {self.course.code} ({grade})"

    def calculate_final_grade(self):
        """Hitung nilai akhir: 30% tugas, 30% UTS, 40% UAS"""
        scores = [self.assignment_score, self.midterm_score, self.final_score]
        
        if all(score is not None for score in scores):
            total = (float(self.assignment_score) * 0.3 +
                    float(self.midterm_score) * 0.3 +
                    float(self.final_score) * 0.4)
            
            self.final_grade = round(total, 2)
            self.letter_grade = self._convert_to_letter(self.final_grade)
            return self.final_grade
        return None

    def _convert_to_letter(self, score):
        """Convert angka ke huruf"""
        if score >= 85: return 'A'
        elif score >= 80: return 'A-'
        elif score >= 75: return 'B+'
        elif score >= 70: return 'B'
        elif score >= 65: return 'B-'
        elif score >= 60: return 'C+'
        elif score >= 55: return 'C'
        elif score >= 40: return 'D'
        return 'E'

    def get_grade_point(self):
        """Dapatkan poin untuk IPK"""
        return self.GRADE_POINTS.get(self.letter_grade, 0.0)

    def save(self, *args, **kwargs):
        self.calculate_final_grade()
        super().save(*args, **kwargs)
        