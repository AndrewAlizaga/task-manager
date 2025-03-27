import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from internal.routes.auth import auth_bp
from internal.routes.tasks import tasks_bp
from internal.models import db
from internal.logging_config import setup_logging

BUILD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client", "build")

def create_app():
    app = Flask(
        __name__,
        static_folder='../client/build'
    )

    # Config
    app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", "super-secret-key")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI", "sqlite:///tasks.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)
    setup_logging(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    # API Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp, url_prefix="/api")
    
    return app
