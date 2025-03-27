from flask import Blueprint, request, jsonify
from ..security.jwt import generate_token
from http import HTTPStatus

auth_bp = Blueprint("auth", __name__)

# Simulate a user DB, this is gonna hardcoded for demonstration purposes
USER_DB = {"admin": "password123"}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # todo: needs augmentation if we were to deal with real users
    if USER_DB.get(username) == password:
        token = generate_token(username)
        return jsonify({"token": token}), HTTPStatus.OK

    return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED
