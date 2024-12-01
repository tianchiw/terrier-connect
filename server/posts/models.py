from django.db import models
from users.models import User
from django.contrib.postgres.search import SearchVectorField
from django.db.models import Index

class Post(models.Model):
    title = models.CharField(max_length=255)  # New field for title
    content = models.TextField()
    image_url = models.ImageField(upload_to='post_media/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    geolocation = models.CharField(max_length=255, blank=True, null=True)  # Assuming this is a simple char field
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    search_vector = SearchVectorField(null=True)  # For full-text search

    def __str__(self):
        return f"Post {self.id} by {self.author.display_name}"

    class Meta:
        indexes = [
            Index(fields=['search_vector']),  # Add an index for efficient search
        ]

class Comment(models.Model):
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment {self.id} by {self.author.display_name}"

    class Meta:
        indexes = [
            Index(fields=['post', 'parent']),  # Index to optimize queries for comments by post and parent
        ]
        ordering = ['create_time']  # Order comments by creation time