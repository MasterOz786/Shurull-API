# tests/test_flask_api.py
import pytest
from flask import Flask

# Create a simple Flask app
app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return "OK", 200

# Test the health check endpoint
def test_health_check():
    with app.test_client() as client:
        response = client.get('/health')
        assert response.status_code == 200
        assert response.data == b"OK"

