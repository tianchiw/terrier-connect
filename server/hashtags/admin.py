from django.contrib import admin
from .models import Hashtag, PostHashtagRel

# Register your models here.
admin.site.register(Hashtag)
admin.site.register(PostHashtagRel)