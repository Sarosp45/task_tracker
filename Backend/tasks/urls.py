from django.urls import path
from . import views

urlpatterns = [
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('tasks/', views.task_list, name='task_list'),
    path('tasks/<int:task_id>', views.task_detail, name='task_detail'),
]