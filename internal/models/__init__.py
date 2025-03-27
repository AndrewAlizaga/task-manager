from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()

class TaskStatus(str, Enum):
    PENDING = "pending"
    PROGRESS = "progress"
    FINISHED = "finished"

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default=TaskStatus.PENDING)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status
        }

__all__ = ["db", "Task"]