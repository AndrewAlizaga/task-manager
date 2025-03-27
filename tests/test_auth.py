# tests/test_auth.py

def test_login_success(client):
    response = client.post("/login", json={"username": "admin", "password": "password123"})
    assert response.status_code == 200

def test_login_wrong_password(client):
    response = client.post("/login", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 401
    data = response.get_json()
    assert "Invalid credentials" in data.get("error", "")

def test_login_nonexistent_user(client):
    response = client.post("/login", json={"username": "notreal", "password": "pass"})
    assert response.status_code == 401
    data = response.get_json()
    assert "Invalid credentials" in data.get("error", "")
