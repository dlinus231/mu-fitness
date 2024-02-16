from django.contrib import admin
from .models import User, Workout, Routine, Exercise, BodyPart, Muscle, Tag

# Register your models here.

admin.site.register(User)
admin.site.register(Workout)
admin.site.register(Routine)
admin.site.register(Exercise)
admin.site.register(BodyPart)
admin.site.register(Muscle)
admin.site.register(Tag)