from django.db import models
from users.models import User
from django.contrib.postgres.search import SearchVectorField
from django.db.models import Index

class Post(models.Model):
    content = models.TextField()
    image_url = models.URLField(max_length=255, blank=True, null=True)
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
