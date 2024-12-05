from django.urls import path
from . import views

# Define user-related API endpoints
urlpatterns = [
    path("register", views.register_user, name="register"),
    path("login", views.login_user, name="login"),
    path("protected_route", views.protected_route, name="protected_route"),
    path('user/<int:user_id>/', views.get_user_info_by_id, name='get_user_info_by_id'),
    path('<int:user_id>/follow/', views.follow_user, name='follow_user'),
    path('<int:user_id>/unfollow/', views.unfollow_user, name='unfollow_user'),
    path('<int:user_id>/followers/', views.list_followers, name='list_followers'),
    path('<int:user_id>/following/', views.list_following, name='list_following'),  # Added for listing following users
    path('update_profile/', views.update_profile, name='update_profile'),
    path('change_password/', views.change_password, name='change_password'),
]
