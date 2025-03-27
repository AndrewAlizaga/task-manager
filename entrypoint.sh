#!/bin/sh

echo "🧪 Available tables before upgrade:"
python -c "from internal.models import db, Task; from main import app; with app.app_context(): print(db.engine.table_names())"

echo "⚙️ Running database migrations..."
flask db upgrade

echo "✅ Available tables after upgrade:"
python -c "from internal.models import db, Task; from main import app; with app.app_context(): print(db.engine.table_names())"

echo "🚀 Starting Gunicorn..."
exec gunicorn main:app -b 0.0.0.0:8080 -w 2 -t 120
