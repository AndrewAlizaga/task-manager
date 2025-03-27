from ..security.jwt import decode_token, generate_token
from flask import Blueprint, request, jsonify, session
from functools import wraps

crud_bp = Blueprint('crud', __name__)

# this middleware handles authentication management in the different endpoints
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]
        user_data = decode_token(token)
        if not user_data:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Optionally attach user to request context
        request.user = user_data["username"]
        return f(*args, **kwargs)
    return decorated_function
