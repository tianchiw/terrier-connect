from django.urls import path

from . import views

# Add URLs here when you create new APIs in this app
urlpatterns = [
    path("login_auth_example", views.login_auth_example, name="user"),
]