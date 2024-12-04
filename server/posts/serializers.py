# posts/serializers.py

from rest_framework import serializers
from .models import Post
from .models import Comment

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','title', 'content', 'image_url', 'timestamp', 'geolocation', 'author', 'create_time', 'update_time']

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    display_name = serializers.CharField(source='author.display_name', read_only=True)
    avatar_url = serializers.CharField(source='author.avatar_url', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'parent', 'create_time', 'replies', 'display_name', 'avatar_url']

    def get_replies(self, obj):
        # Serialize replies recursively
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []
    
class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'author', 'content', 'parent']
