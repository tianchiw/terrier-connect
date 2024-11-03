from django.contrib import admin
from .models import Hashtag, Post_hashtag_rel

# Register your models here.
admin.site.register(Hashtag)
admin.site.register(Post_hashtag_rel)