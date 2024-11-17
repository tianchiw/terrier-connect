from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from users.models import User  # Import the User model
from .serializers import PostSerializer
import jwt
from hashtags.views import add_post_hashtags_rel
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Helper function to decode JWT token
def decode_jwt_token(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise ValueError('Token has expired')
    except jwt.InvalidTokenError:
        raise ValueError('Invalid token')

# Helper function to get user information from the request
def get_user_info(request):
    token = request.headers.get('Authorization', '').split(' ')[-1]
    return decode_jwt_token(token)

@api_view(['POST'])
def add_post(request):
    try:
        user_info = get_user_info(request)  # Decodes JWT token to get user info
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the user instance based on the decoded JWT token ID
    try:
        author = User.objects.get(id=user_info['id'])
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    request.data['author'] = author.id
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        # Save the post with the author's instance
        serializer.save()
        # Add post-hashtags relationship
        add_post_hashtags_rel(serializer.instance, request.data.get('hashtags', []))
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_post_detail(request, pk):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['PUT'])
def update_post(request, pk):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        post = Post.objects.get(pk=pk, author_id=user_info['id'])
    except Post.DoesNotExist:
        return Response({'error': 'Post not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_post(request, pk):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        post = Post.objects.get(pk=pk, author_id=user_info['id'])
    except Post.DoesNotExist:
        return Response({'error': 'Post not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

    post.delete()
    return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def list_posts(request):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    posts = Post.objects.all()  # Retrieve all posts
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@receiver(post_save, sender=Post)
def update_search_vector(sender, instance, **kwargs):
    # Avoid recursion by using a custom attribute
    if not hasattr(instance, '_updating_search_vector'):
        instance._updating_search_vector = True  # Set the flag
        instance.search_vector = SearchVector('content')  # Update the search vector
        instance.save()
        del instance._updating_search_vector  # Remove the flag to allow future saves

@api_view(['GET'])
def full_text_search(request):
    query = request.query_params.get('query', '')
    page = request.query_params.get('page', 1)  # Default to page 1
    page_size = request.query_params.get('pageSize', 10)  # Default to 10 items per page

    if not query:
        return Response({'error': 'No query parameter provided'}, status=400)
    
    search_query = SearchQuery(query)
    search_vector = SearchVector('content')  # Specify the fields to search
    posts = Post.objects.annotate(
        rank=SearchRank(search_vector, search_query)  # Rank results by relevance
    ).filter(search_vector=search_query).order_by('-rank')  # Order by rank

    # Pagination
    paginator = Paginator(posts, page_size)
    try:
        paginated_posts = paginator.page(page)
    except PageNotAnInteger:
        return Response({'error': 'Invalid page number'}, status=400)
    except EmptyPage:
        return Response({'error': 'Page out of range'}, status=400)
    
    serializer = PostSerializer(paginated_posts, many=True)

    return Response({
        'page': page,
        'pageSize': page_size,
        'totalItems': paginator.count,
        'totalPages': paginator.num_pages,
        'results': serializer.data
    })