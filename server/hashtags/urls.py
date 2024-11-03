from django.urls import path
from . import views

# Define the URLs for the hashtags app
urlpatterns = [
    path("hashtags_list/", views.hashtags_list), # e.g., http://localhost:8000/hashtags/hashtags_list/
    path("hashtags_create/", views.hashtags_create),
    path("hashtags_detail/<int:pk>/", views.hashtags_detail),
    path("hashtags_search/", views.hashtags_search),
    path("hashtags_update/<int:pk>/", views.hashtags_update),
    path("hashtags_delete/<int:pk>/", views.hashtags_delete),
    path("hashtags_create_bulk/", views.hashtags_create_bulk),
    path("add_post_hashtags_rel_by_ids/", views.add_post_hashtags_rel_by_ids),
    path("get_post_hashtags_by_post_id/<int:post_id>/", views.get_post_hashtags_by_post_id),
    path("get_posts_by_hashtag_id/<int:hashtag_id>/", views.get_posts_by_hashtag_id),
]