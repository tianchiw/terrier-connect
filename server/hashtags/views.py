from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from hashtags.models import Hashtag, PostHashtagRel
from hashtags.serializer import HashtagSerializer
from users.decorators import jwt_required
import jwt
from django.conf import settings

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
    hashtags = [Hashtag.objects.get(id=post_hashtag_rel.hashtag_id) for post_hashtag_rel in post_hashtag_rels]
    serializer = HashtagSerializer(hashtags, many=True)
    return Response(serializer.data)

@jwt_required
@api_view(['GET'])
def get_posts_by_hashtag_id(request, hashtag_id):
    post_hashtag_rels = PostHashtagRel.objects.filter(hashtag_id=hashtag_id)
    post_ids = [post_hashtag_rel.post_id for post_hashtag_rel in post_hashtag_rels]
    return Response({'post_ids': post_ids})