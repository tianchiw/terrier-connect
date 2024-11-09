from django.db import models
from posts.models import Post

# Create your models here.
class Hashtag(models.Model):
    # Don't need to specify primary key because Django will automatically create an auto-incrementing primary key
    hashtag_text = models.CharField(max_length=100)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.hashtag_text
    
class PostHashtagRel(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    hashtag_id = models.ForeignKey(Hashtag, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Post {self.post_id} - Hashtag {self.hashtag_id}'