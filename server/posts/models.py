from django.db import models
from users.models import User
from hashtags.models import Hashtag

class Post(models.Model):
    content = models.TextField()
    image_url = models.URLField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    geolocation = models.CharField(max_length=255, blank=True, null=True)  # Assuming this is a simple char field
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post {self.id} by {self.author.display_name}"

class PostHashtagRel(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post {self.post.id} tagged with {self.hashtag.hashtag_text}"
