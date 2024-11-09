# posts/serializers.py

from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'content', 'image_url', 'timestamp', 'geolocation', 'author', 'create_time', 'update_time']
