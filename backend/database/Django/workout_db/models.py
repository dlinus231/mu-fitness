from django.db import models
from django.utils import timezone
import datetime

# Create your models here.

class User(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=100, unique=True)
    last_login = models.DateTimeField(null=True, blank=True)
    password_hashed = models.CharField(max_length=255)
    time_created = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=25)
    workouts = models.ManyToManyField('Workout', related_name="user_workouts", blank=True)
    
    def __str__(self):
        return f"User: {self.username}"

class Workout(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ManyToManyField(User, related_name='user_workouts', blank=True)
    name = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=50, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('expert', 'Expert')])
    description = models.TextField(blank = True)
    time_created = models.DateTimeField(auto_now_add=True)
    muscle_groups = models.ManyToManyField('Muscle')
    routines = models.ManyToManyField('Routine', related_name='workout_routines', blank=True)
    tag = models.ForeignKey('Tag', on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"Workout: {self.name} ({self.get_difficulty_display()})"


# e.g. 3 sets of squats at 200 lbs with 90 second rests
class Routine(models.Model):
    id = models.AutoField(primary_key=True)
    # exercise_id = models.IntegerField()
    repetitions = models.IntegerField()
    weight_lbs = models.IntegerField()
    rest_seconds = models.IntegerField()
    workout = models.ForeignKey(Workout, on_delete=models.DO_NOTHING, related_name='workout_routines')
    exercise = models.ForeignKey('Exercise', on_delete=models.DO_NOTHING)

    def __str__(self): 
        return f"Routine: {self.repetitions}x of {self.exercise.name} at {self.weight_lbs} lbs with {self.rest_seconds} second rest"

# e.g. legs, arms, back
class BodyPart(models.Model): 
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return f"BodyPart: {self.name}"

# e.g. quad, triceps, lower back
class Muscle(models.Model): 
    name = models.CharField(max_length=255, unique=True)
    body_part = models.ForeignKey(BodyPart, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Muscle: {self.name} ({self.body_part.name})"


class Exercise(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=50, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('expert', 'Expert')])
    description = models.TextField(blank = True)
    video_path = models.CharField(max_length=255, blank=True)
    muscles = models.ManyToManyField(Muscle)
    tags = models.ManyToManyField('Tag', related_name='ExerciseToTag')
    
    def __str__(self):
        return f"Exercise: {self.name} ({self.get_difficulty_display()})"


# e.g. leg day, push/pull
class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return f"Tag: {self.name}"

class Difficulty(models.TextChoices):
    BEGINNER = 'beginner', 'Beginner'
    INTERMEDIATE = 'intermediate', 'Intermediate'
    EXPERT = 'expert', 'Expert'
