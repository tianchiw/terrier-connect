from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
import jwt
import datetime
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage  # Import for pagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserFollowRel, User

from server.posts.views import get_user_info
from .models import User, UserFollowRel
import re


# Helper function to check password strength
def is_password_strong(password):
    """
    Checks if the password meets security criteria:
    - At least 8 characters
    - Contains at least one digit
    - Contains at least one special character
    """
    return len(password) >= 8 and re.search(r'\d', password) and re.search(r'[\W_]', password)


# Helper function to generate JWT token
def generate_jwt_token(user):
    """
    Generates a JWT token with user information and expiration time.
    Payload includes:
    - id: User's ID
    - email: User's email
    - display_name: User's display name
    - exp: Token expiration set to 8 hours from creation time
    """
    payload = {
        'id': user.id,
        'email': user.email,
        'display_name': user.display_name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)  # Token expires in 8 hours
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


# Helper function to decode and validate JWT token
def decode_jwt_token(token):
    """
    Decodes a JWT token and handles potential errors.
    Raises:
    - ValueError if token is expired or invalid.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise ValueError('Token has expired')
    except jwt.InvalidTokenError:
        raise ValueError('Invalid token')


# Register API
@api_view(['POST'])
def register_user(request):
    """
    Registers a new user by:
    - Validating email and password format
    - Checking for email uniqueness
    - Hashing the password and saving user data to the database
    Returns a success message if registration is successful.
    """
    data = request.data
    email = data.get('email')
    password = data.get('password')
    display_name = data.get('display_name', '')

    # Validate email and password presence
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email format is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return Response({'error': 'Invalid email format.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email is already registered
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email is already registered.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Ensure password meets strength requirements
    if not is_password_strong(password):
        return Response({'error': 'Password must be at least 8 characters long, include a number and a special character.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Create user with hashed password
    user = User.objects.create(email=email, display_name=display_name, password=make_password(password))
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)


# Login API
@api_view(['POST'])
def login_user(request):
    """
    Authenticates a user and issues a JWT token upon successful login.
    - Verifies the provided email and password.
    - Generates and returns a JWT token with user information.
    """
    data = request.data
    email = data.get('email')
    password = data.get('password')

    # Validate email and password presence
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve and authenticate user
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if password matches the stored hash
    if not check_password(password, user.password):
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT token for the authenticated user
    token = generate_jwt_token(user)
    return Response({'token': token, 'user': {'id': user.id, 'email': user.email, 'display_name': user.display_name}})


# Example of a protected route using JWT
@api_view(['GET'])
def protected_route(request):
    """
    Protected route example.
    - Extracts JWT token from Authorization header.
    - Decodes and validates the token.
    - Returns access granted message if token is valid, else returns an error.
    """
    token = request.headers.get('Authorization', '').split(' ')[-1]
    try:
        user_data = decode_jwt_token(token)
        return Response({'message': 'Access granted', 'user_data': user_data})
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# Get User Info by ID API
@api_view(['GET'])
def get_user_info_by_id(request, user_id):
    """
    Retrieves user information by user ID.
    - Requires JWT token for authentication.
    - Fetches user details for the given user_id, excluding sensitive fields.
    """
    # Check if JWT token is provided and valid
    token = request.headers.get('Authorization', '').split(' ')[-1]
    try:
        decode_jwt_token(token)  # Only validating if the token is valid, no data needed here
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch user details by user_id
    try:
        user = User.objects.get(id=user_id)
        user_info = {
            'id': user.id,
            'email': user.email,
            'display_name': user.display_name,
            'bio': user.bio  # Include other non-sensitive fields if available
        }
        return Response({'user': user_info})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def follow_user(request, user_id):
    """
    API to follow another user.
    - Authenticated user can follow a user by user_id.
    """
    try:
        user_info = get_user_info(request)  # Authenticate the request
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    follower = User.objects.get(id=user_info['id'])
    try:
        following = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    if follower == following:
        return Response({'error': 'Users cannot follow themselves.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the relationship already exists
    if UserFollowRel.objects.filter(follower=follower, following=following).exists():
        return Response({'error': 'Already following this user.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the follow relationship
    UserFollowRel.objects.create(follower=follower, following=following)
    return Response({'message': f'{follower.display_name} is now following {following.display_name}.'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def unfollow_user(request, user_id):
    """
    API to unfollow a user.
    - Authenticated user can unfollow a user by user_id.
    """
    try:
        user_info = get_user_info(request)  # Authenticate the request
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    follower = User.objects.get(id=user_info['id'])
    try:
        following = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the relationship exists
    try:
        follow_relation = UserFollowRel.objects.get(follower=follower, following=following)
    except UserFollowRel.DoesNotExist:
        return Response({'error': 'Not following this user.'}, status=status.HTTP_400_BAD_REQUEST)

    # Delete the follow relationship
    follow_relation.delete()
    return Response({'message': f'{follower.display_name} has unfollowed {following.display_name}.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def list_followers(request, user_id):
    """
    API to list all followers of a user.
    - Uses pagination for better performance.
    """
    page = request.query_params.get('page', 1)
    page_size = request.query_params.get('pageSize', 10)

    try:
        # Ensure the user exists
        User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Fetch followers
    followers = UserFollowRel.objects.filter(following_id=user_id).select_related('follower')

    # Paginate the results
    paginator = paginator(followers, page_size)
    try:
        paginated_followers = paginator.page(page)
    except PageNotAnInteger:
        return Response({'error': 'Invalid page number.'}, status=status.HTTP_400_BAD_REQUEST)
    except EmptyPage:
        return Response({'error': 'Page out of range.'}, status=status.HTTP_404_NOT_FOUND)

    # Serialize followers
    results = [{'id': rel.follower.id, 'display_name': rel.follower.display_name, 'email': rel.follower.email}
               for rel in paginated_followers]

    return Response({
        'page': page,
        'pageSize': page_size,
        'totalItems': paginator.count,
        'totalPages': paginator.num_pages,
        'results': results
    }, status=status.HTTP_200_OK)
