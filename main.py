import os
from flask import Flask, send_from_directory
from internal.app import create_app

app = create_app()

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        print("ding")
        print(app.static_folder, path)
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
