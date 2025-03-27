import datetime
import jwt
import os

SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "fallback-secret")

def generate_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
