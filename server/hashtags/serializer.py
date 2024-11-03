from rest_framework import serializers
from .models import Hashtag

# This is a serializer for the Hashtag model, which will be used to convert the model to JSON format.
class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = "__all__"