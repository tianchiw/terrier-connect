from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
import jwt
import datetime
from .models import User
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
