# -------- Stage 1: Build React frontend --------
    FROM node:18-alpine AS frontend

    WORKDIR /app

    # Install git for npm installs that rely on git repos
    RUN apk add --no-cache git

    COPY client/ ./client
    WORKDIR /app/client
    
    RUN npm install
    RUN npm run build
    
    # -------- Stage 2: Python + Flask --------
    FROM python:3.11-slim
    
    WORKDIR /app
    
    # Install Python dependencies
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy backend
    COPY internal ./internal
    COPY main.py .
    COPY .env .
    
    # Copy React build
    COPY --from=frontend /app/client/build ./client/build
    
    # Expose port
    EXPOSE 8080
    
    # Flask configuration
    ENV FLASK_APP=main.py
    ENV FLASK_RUN_PORT=8080
    
    # Remove old DB and recreate it at container start
    CMD rm -f tasks.db && \
    python -c "from internal.models import db; from main import app; app.app_context().push(); db.create_all()" && \
    gunicorn main:app -b 0.0.0.0:8080 -w 2 -t 120

    