from django.shortcuts import render
from django.conf import settings
import jwt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import datetime

# Create your views here.
@api_view(['POST'])
def login_auth_example(request):
    # This is an example of login API, aim to show you how to create JWT token after login
    data = request.POST
    email = data.get('email')
    password = data.get('password')
    # ============== Your login logic here ==============



    # After your login logic, create JWT token before return it to the client
    user_info = {
        # Put the user information here
        'id': 1,
        'email': 'example@bu.edu',
        'password_hash': 'example_password',
        'display_name': 'example_user',
        # Other information if there is 
    }
    # Set expiration time for the token, it's required, you can set it to 8 hours
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    user_info['exp'] = expiration
    # Encode the user information to JWT token
    token = jwt.encode(user_info, settings.SECRET_KEY, algorithm='HS256')
    # The password_hash has been encoded in the token, so don't need to return it to the client
    user_info.pop('password_hash')
    # Return the token and user_info to the client
    return Response({'token': token.decode('utf-8'), 'user': user_info})
