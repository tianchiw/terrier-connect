from django.urls import path

from . import views

# Add URLs here when you create new APIs in this app
urlpatterns = [
    # path("login_auth_example", views.login_auth_example, name="user"),
    path("register", views.register_user, name="register"),
    path("login", views.login_user, name="login"),
    path("protected_route", views.protected_route, name="protected_route"),

]