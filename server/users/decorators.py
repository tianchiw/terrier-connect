import jwt
from django.conf import settings
from django.http import JsonResponse

# This is a decorator to check if the user has a valid JWT token. Add this decorator to the APIs that you want to protect.
def jwt_required(func):
    def wrapper(request, *args, **kwargs):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        try:
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            request.user = decoded  # Attach user info to the request
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        return func(request, *args, **kwargs)
    return wrapper