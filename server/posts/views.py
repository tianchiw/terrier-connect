from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .models import Comment
from users.models import User  # Import the User model
from .serializers import PostSerializer, CommentSerializer, CommentCreateSerializer
import jwt
from hashtags.views import add_post_hashtags_rel
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from hashtags.models import PostHashtagRel
from hashtags.models import Hashtag
from users.decorators import jwt_required

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
def get_post_detail(request, post_id):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['PUT'])
def update_post(request, post_id):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the user instance based on the decoded JWT token ID
    try:
        author = User.objects.get(id=user_info['id'])
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        post = Post.objects.get(pk=post_id, author_id=author.id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

    # Include author in the request data
    request.data['author'] = author.id

    serializer = PostSerializer(post, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_post(request, post_id):  # Changed `pk` to `post_id`
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        post = Post.objects.get(pk=post_id, author_id=user_info['id'])  # Updated here as well
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

@api_view(['GET'])
def list_posts_by_tag(request):
    # Get the query parameters
    tag = request.query_params.get('tag', None)
    page = request.query_params.get('page', 1)  # Default page is 1
    page_size = request.query_params.get('pageSize', 10)  # Default page size is 10

    if not tag:
        return Response({'error': 'Tag parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the hashtag object
        hashtag = Hashtag.objects.get(hashtag_text=tag)
    except Hashtag.DoesNotExist:
        return Response({'error': f'Hashtag "{tag}" not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve posts related to the hashtag
    post_relations = PostHashtagRel.objects.filter(hashtag_id=hashtag)
    posts = [relation.post_id for relation in post_relations]  # Extract posts from relationships

    # Paginate the posts
    paginator = Paginator(posts, page_size)
    try:
        paginated_posts = paginator.page(page)
    except PageNotAnInteger:
        return Response({'error': 'Invalid page number.'}, status=status.HTTP_400_BAD_REQUEST)
    except EmptyPage:
        return Response({'error': 'Page out of range.'}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the paginated posts
    serializer = PostSerializer(paginated_posts, many=True)

    # Return the response with pagination info
    return Response({
        'page': page,
        'pageSize': page_size,
        'totalItems': paginator.count,
        'totalPages': paginator.num_pages,
        'results': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_comment(request):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    
    request.data['author'] = user_info['id']

    serializer = CommentCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@jwt_required
@api_view(['PUT'])
def update_comment(request, comment_id):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        comment = Comment.objects.get(pk=comment_id, author_id=user_info['id'])
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found or not authorized user'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CommentCreateSerializer(comment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_comment(request, comment_id):
    try:
        user_info = get_user_info(request)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        comment = Comment.objects.get(pk=comment_id, author_id=user_info['id'])
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

    comment.delete()
    return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def list_comments(request, post_id):
    page = request.query_params.get('page', 1)  # Default to page 1
    page_size = request.query_params.get('pageSize', 10)  # Default to 10 items per page
    
    # Fetch top-level comments for the specified post
    comments = Comment.objects.filter(post_id=post_id, parent__isnull=True).select_related('author', 'post').prefetch_related('replies')
    
    # Pagination
    paginator = Paginator(comments, page_size)
    try:
        paginated_posts = paginator.page(page)
    except PageNotAnInteger:
        return Response({'error': 'Invalid page number'}, status=400)
    except EmptyPage:
        return Response({'error': 'Page out of range'}, status=400)
    
    serializer = CommentSerializer(comments, many=True)

    return Response({
        'page': page,
        'pageSize': page_size,
        'totalItems': paginator.count,
        'totalPages': paginator.num_pages,
        'results': serializer.data
    })

@api_view(['GET'])
def list_comments_by_author(request, author_id):
    page = request.query_params.get('page', 1)  # Default to page 1
    page_size = request.query_params.get('pageSize', 10)  # Default to 10 items per page

    comments = Comment.objects.filter(author_id=author_id)

    # Pagination
    paginator = Paginator(comments, page_size)
    try:
        paginated_posts = paginator.page(page)
    except PageNotAnInteger:
        return Response({'error': 'Invalid page number'}, status=400)
    except EmptyPage:
        return Response({'error': 'Page out of range'}, status=400)

    serializer = CommentSerializer(comments, many=True)

    return Response({
        'page': page,
        'pageSize': page_size,
        'totalItems': paginator.count,
        'totalPages': paginator.num_pages,
        'results': serializer.data
    })