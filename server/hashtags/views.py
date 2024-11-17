from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from hashtags.models import Hashtag, PostHashtagRel
from hashtags.serializer import HashtagSerializer
from users.decorators import jwt_required
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import Count
from posts.serializers import PostSerializer

# Create your views here.
@jwt_required # This is a decorator to check if the user has a valid JWT token. Add this decorator to the APIs that you want to protect.
@api_view(['GET'])
def hashtags_list(request):
    # Example: You can get the token from the request header, and then decode the token to get the user information
    token = request.headers.get('Authorization', '').split(' ')[-1]
    user_info= jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    print(f'user_info', user_info)

    hashtags = Hashtag.objects.all()
    serializer = HashtagSerializer(hashtags, many=True)
    return Response(serializer.data)

@jwt_required
@api_view(['POST'])
def hashtags_create(request):
    hashtag_text = request.data.get('hashtag_text')
    if Hashtag.objects.filter(hashtag_text=hashtag_text).exists():
        return Response({'error': 'Hashtag with this text already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = HashtagSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@jwt_required
@api_view(['GET'])
def hashtags_detail(request, pk):
    try:
        hashtag = Hashtag.objects.get(pk=pk)
    except Hashtag.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = HashtagSerializer(hashtag)
    return Response(serializer.data)

@jwt_required
@api_view(['GET'])
def hashtags_search(request):
    hashtag_text = request.query_params.get('hashtag_text')
    hashtags = Hashtag.objects.filter(hashtag_text__icontains=hashtag_text)
    serializer = HashtagSerializer(hashtags, many=True)
    return Response(serializer.data)

@jwt_required
@api_view(['PUT'])
def hashtags_update(request, pk):
    try:
        hashtag = Hashtag.objects.get(pk=pk)
    except Hashtag.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = HashtagSerializer(instance=hashtag, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@jwt_required
@api_view(['DELETE'])
def hashtags_delete(request, pk):
    try:
        hashtag = Hashtag.objects.get(pk=pk)
    except Hashtag.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    hashtag.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@jwt_required
@api_view(['POST'])
def hashtags_create_bulk(request):
    hashtags = request.data
    hashtags_list = []

    for hashtag in hashtags:
        hashtag_text = hashtag.get("hashtag_text")
        if hashtag_text and not Hashtag.objects.filter(hashtag_text=hashtag_text).exists():
            hashtags_list.append(Hashtag(hashtag_text=hashtag_text))

    hashtags_to_return = Hashtag.objects.filter(hashtag_text__in=[hashtag.get('hashtag_text') for hashtag in hashtags])
    serializer = HashtagSerializer(hashtags_to_return, many=True)

    if hashtags_list:
        Hashtag.objects.bulk_create(hashtags_list)
        added_serializer = HashtagSerializer(hashtags_list, many=True)
        return Response({'message': 'Hashtags created successfully', 'hashtags': serializer.data, 'added': added_serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response({'message': 'No new hashtags to add', 'hashtags': serializer.data}, status=status.HTTP_400_BAD_REQUEST)

@jwt_required
@api_view(['POST'])
def add_post_hashtags_rel_by_ids(request):
    post_id = request.data.get('post_id')
    hashtag_ids = request.data.get('hashtag_ids')
    if not post_id or not hashtag_ids:
        return Response({'error': 'post_id and hashtag_ids are required'}, status=status.HTTP_400_BAD_REQUEST)
    post_hashtag_rels = []
    for hashtag_id in hashtag_ids:
        if not Hashtag.objects.filter(id=hashtag_id).exists():
            return Response({'error': f'Hashtag with id {hashtag_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        post_hashtag_rels.append(PostHashtagRel(post_id=post_id, hashtag_id=hashtag_id))
    PostHashtagRel.objects.bulk_create(post_hashtag_rels)
    
    return Response({'message': 'Post-Hashtag relations created successfully'}, status=status.HTTP_201_CREATED)

@jwt_required
@api_view(['GET'])
def get_post_hashtags_by_post_id(request, post_id):
    post_hashtag_rels = PostHashtagRel.objects.filter(post_id=post_id)
    hashtags = [post_hashtag_rel.hashtag_id for post_hashtag_rel in post_hashtag_rels]
    serializer = HashtagSerializer(hashtags, many=True)
    return Response(serializer.data)

@jwt_required
@api_view(['GET'])
def get_posts_by_hashtag_id(request, hashtag_id):
    post_hashtag_rels = PostHashtagRel.objects.filter(hashtag_id=hashtag_id)
    # post_ids = [post_hashtag_rel.post_id for post_hashtag_rel in post_hashtag_rels]
    posts = [post_hashtag_rel.post_id for post_hashtag_rel in post_hashtag_rels]
    print(posts)
    serializer = PostSerializer(posts, many=True)

    return Response({'posts': serializer.data})

@jwt_required
@api_view(['GET'])
def get_popular_hashtags(request):
    # Get PostHashtagsRel records to only include those created in the last 24 hours.
    last_24_hours = datetime.now() - timedelta(hours=24)
    post_hashtag_rels = PostHashtagRel.objects.filter(created_time__gte=last_24_hours)
    hashtag_objs = [post_hashtag_rel.hashtag_id for post_hashtag_rel in post_hashtag_rels]

    # Count the number of times each hashtag appears in the list.
    hashtag_count = {}
    for hashtag in hashtag_objs:
        hashtag_str = str(hashtag)
        if hashtag_str in hashtag_count:
            hashtag_count[hashtag_str] += 1
            print(hashtag_count[hashtag_str])
        else:
            hashtag_count[hashtag_str] = 1
    
    # Limits the results to the top 10 trending hashtags.
    sorted_hashtag_count = dict(sorted(hashtag_count.items(), key=lambda item: item[1], reverse=True)[:10])
    print(sorted_hashtag_count)
    
    return Response(sorted_hashtag_count)

def add_post_hashtags_rel(post, hashtags):
    if not hashtags and len(hashtags) == 0:
        return
    # Get hashtags id by hashtag_text in the list of hashtags
    hashtag_instances = []
    for hashtag_text in hashtags:
        try:
            hashtag = Hashtag.objects.get(hashtag_text=hashtag_text)
        except Hashtag.DoesNotExist:
            hashtag = None
        if hashtag:
            hashtag_instances.append(hashtag)
        else:
            new_hashtag = Hashtag.objects.create(hashtag_text=hashtag_text)
            hashtag_instances.append(new_hashtag)
    
    # Create PostHashtagRel objects
    post_hashtag_rels = []
    for hashtag_instance in hashtag_instances:
        post_hashtag_rels.append(PostHashtagRel(post_id=post, hashtag_id=hashtag_instance))
    
    PostHashtagRel.objects.bulk_create(post_hashtag_rels)
    return