from django.contrib import admin
from .models import User, UserFollowRel

# Register your models here.
admin.site.register(User)
admin.site.register(UserFollowRel)