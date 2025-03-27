from functools import wraps
from http import HTTPStatus

def requires_auth(test_func):
    """ Utility wrapper to manage login & athentication for unti tests"""
    
    @wraps(test_func)
    def wrapper(client, *args, **kwargs):
        login_response = client.post("/login", json={"username": "admin", "password": "password123"})
        token = login_response.get_json()["token"]
        client.environ_base["HTTP_AUTHORIZATION"] = f"Bearer {token}"
        return test_func(client, *args, **kwargs)
    return wrapper

@requires_auth
def test_create_task(client):
    """ Unit test asserts create task functionality """
    response = client.post("/api/tasks", json={"title": "Test Task", "description": "Do something"})
    assert response.status_code == HTTPStatus.CREATED
    data = response.get_json()
    assert data["message"] == "Task created"
    assert "id" in data

@requires_auth
def test_get_task(client):
    """ Unit test asserts create tasks functionality """
    create = client.post("/api/tasks", json={"title": "Another", "description": "Stuff"})
    task_id = create.get_json()["id"]
    get = client.get(f"/api/tasks/{task_id}")
    assert get.status_code == HTTPStatus.OK
    assert get.get_json()["title"] == "Another"

@requires_auth
def test_update_task(client):
    """ Unit test asserts update task functionality """
    create = client.post("/api/tasks", json={"title": "Temp", "description": "To change"})
    task_id = create.get_json()["id"]
    update = client.put(f"/api/tasks/{task_id}", json={"title": "Updated", "status": "progress"})
    assert update.status_code == HTTPStatus.OK
    get = client.get(f"/api/tasks/{task_id}")
    assert get.get_json()["title"] == "Updated"
    assert get.get_json()["status"] == "progress"

@requires_auth
def test_delete_task(client):
    """ Unit test asserts delete task functionality """
    create = client.post("/api/tasks", json={"title": "Temp", "description": "Delete"})
    task_id = create.get_json()["id"]
    delete = client.delete(f"/api/tasks/{task_id}")
    assert delete.status_code == HTTPStatus.OK
    get = client.get(f"/api/tasks/{task_id}")
    assert get.status_code == HTTPStatus.NOT_FOUND

def test_access_denied_without_token(client):
    """ Unit test asserts routes are protected via authentication """
    response = client.get("/api/tasks")
    assert response.status_code == HTTPStatus.FORBIDDEN or response.status_code == HTTPStatus.UNAUTHORIZED