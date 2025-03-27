from flask import Blueprint, request, jsonify
from http import HTTPStatus
from ..models import db, Task, TaskStatus
from ..middleware.auth import login_required

tasks_bp = Blueprint('tasks', __name__)

# TASK ROUTES DEFINITION
@tasks_bp.route("/tasks", methods=["GET"])
@login_required
def list_tasks():
    return jsonify([task.to_dict() for task in Task.query.all()])

@tasks_bp.route("/tasks/<int:task_id>", methods=["GET"])
@login_required
def get_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), HTTPStatus.NOT_FOUND
    return jsonify(task.to_dict())

@tasks_bp.route("/tasks", methods=["POST"])
@login_required
def create_task():
    data = request.get_json()
    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        status=data.get("status", TaskStatus.PENDING)
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created", "id": task.id}), HTTPStatus.CREATED

@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@login_required
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), HTTPStatus.NOT_FOUND

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    db.session.commit()
    return jsonify({"message": "Task updated"})

@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), HTTPStatus.NOT_FOUND

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})
