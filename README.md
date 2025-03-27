# 📝 Task Manager API & CLIENT

A minimal, secure, and demo-ready Flask API & REACT Client for managing tasks with JWT authentication, SQLite storage, and Dockerized deployment.

---

## 📦 Features

- JWT-based authentication with a hardcoded `admin` user
- CRUD for tasks (`title`, `description`, `status`)
- SQLite for persistent storage
- Clean architecture (`routes`, `middleware`, `internal`)
- Docker-ready for deployment
- Fully tested using `pytest`

---

## 📁 Project Structure

## How to run

you can run the project directly via 
`python3 main.py`

Or dockerize it via
`docker build -t flask-tasks .`
`docker run --env-file .env -p 8080:5000 flask-tasks`
