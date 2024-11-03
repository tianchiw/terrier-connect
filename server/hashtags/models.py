from django.db import models

# Create your models here.
class Hashtag(models.Model):
    # Don't need to specify primary key because Django will automatically create an auto-incrementing primary key
    hashtag_text = models.CharField(max_length=100)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.hashtag_text
    
class Post_hashtag_rel(models.Model):
    post_id = models.IntegerField()
    hashtag_id = models.IntegerField()
    created_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.post_id} - {self.hashtag_id}'