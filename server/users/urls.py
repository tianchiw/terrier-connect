from django.urls import path

from . import views

# Add URLs here when you create new APIs in this app
urlpatterns = [
    # path("login_auth_example", views.login_auth_example, name="user"),
    path("register", views.register_user, name="register"),
    path("login", views.login_user, name="login"),
    path("protected_route", views.protected_route, name="protected_route"),
    path('user/<int:user_id>/', views.get_user_info_by_id, name='get_user_info_by_id'),
    path('<int:user_id>/follow/', views.follow_user, name='follow_user'),
    path('<int:user_id>/unfollow/', views.unfollow_user, name='unfollow_user'),
    path('<int:user_id>/followers/', views.list_followers, name='list_followers'),

]
