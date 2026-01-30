from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout as auth_logout


tasks_db = {}
task_counter = 0

users = {
    1: {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'Test@123'
    }
}
user_counter = 1


@csrf_exempt
def signup(request):

    global user_counter
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        for user in users.values():
            if user['username'] == username:
                return JsonResponse({'error': 'Username already exists'}, status=400)
        
        user_counter += 1
        users[user_counter] = {
            'id': user_counter,
            'username': username,
            'email': email,
            'password': password
        }
        return JsonResponse({'message': 'User created successfully', 'user_id': user_counter}, status=201)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def login(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        for user_id, user in users.items():
            if user['username'] == username and user['password'] == password:
                request.session['user'] = username
                request.session['user_id'] = user_id

                return JsonResponse({
                    'message': 'Login Successful',
                    'token': f'mock-jwt-token-{user_id}',
                    'user_id': user_id
                })
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def logout(request):

    auth_logout(request)
    request.session.flush()
    return JsonResponse({'message': 'Logout successful'})


@csrf_exempt
def task_list(request):

    global task_counter
    
    if 'user' not in request.session:
        return JsonResponse({'error': 'Not authorized, Please login first'}, status=401)
    
    user_id = request.session.get('user_id')

    if request.method == 'GET':

        status_filter = request.GET.get('status')
        user_tasks = [t for t in tasks_db.values() if t['user_id'] == user_id]
        
        if status_filter:
            user_tasks = [t for t in user_tasks if t['status'] == status_filter]
        
        return JsonResponse(user_tasks, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        task_counter += 1
        task = {
            'id': task_counter,
            'user_id': user_id,
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'status': data.get('status', 'Open') 
        }
        tasks_db[task_counter] = task
        return JsonResponse(task, status=201)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def task_detail(request, task_id):

    if 'user' not in request.session:
        return JsonResponse({'error': 'Not authorized, Please login first'}, status=401)

    if request.method == 'GET':
        task = tasks_db.get(task_id)
        if task:
            return JsonResponse(task)
        return JsonResponse({'error': 'Task not found'}, status=404)
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        if task_id in tasks_db:
            task = tasks_db[task_id]
            task['title'] = data.get('title', task['title'])
            task['description'] = data.get('description', task['description'])
            task['status'] = data.get('status', task['status'])
            return JsonResponse(task)
        return JsonResponse({'error': 'Task not found'}, status=404)
    
    elif request.method == 'DELETE':
        if task_id in tasks_db:
            del tasks_db[task_id]
            return JsonResponse({'message': 'Task deleted'}, status=200)
        return JsonResponse({'error': 'Task not found'}, status=404)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
    