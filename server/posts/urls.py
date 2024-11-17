from django.urls import path
from . import views

urlpatterns = [
    path('add_post/', views.add_post, name='add_post'),
    path('get_post_detail/<int:post_id>/', views.get_post_detail, name='get_post_detail'),
    path('update_post/<int:post_id>/', views.update_post, name='update_post'),
    path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('list_posts/', views.list_posts, name='list_posts'),
    path('list_posts_by_tag/', views.list_posts_by_tag, name='list_posts_by_tag'),  
    path('full_text_search/', views.full_text_search, name='full_text_search'),
]
