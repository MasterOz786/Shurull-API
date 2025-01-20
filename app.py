from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import git
import os
import socket
import uuid
import zipfile
from werkzeug.utils import secure_filename
from prometheus_client import start_http_server, Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
from config import Config
from logger import setup_logger
from queue_service import DeploymentQueue
from mongodb_service import MongoDBService

# Configure logging
logger = setup_logger(__name__)

app = Flask(__name__)
CORS(app, origins=['https://shurulls.pro', '*'])

# Initialize services
deployment_queue = DeploymentQueue()
mongodb_service = MongoDBService()

# Prometheus metrics
REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('api_request_latency_seconds', 'API request latency')

@app.route('/metrics')
def metrics():
    """Expose Prometheus metrics."""
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route('/deploy', methods=['POST'])
@REQUEST_LATENCY.time()
def deploy():
    REQUEST_COUNT.labels(method='POST', endpoint='/deploy').inc()
    try:
        # Validate request
        if not request.json or 'email' not in request.json:
            return jsonify({'error': 'Email is required'}), 400

        email = request.json['email']
        deployment_id = str(uuid.uuid4())
        logger.info(f"Received deployment request with ID: {deployment_id} for user: {email}")

        deployment_data = {
            'deployment_id': deployment_id,
            'email': email,
            'request_data': request.files if request.files else request.json
        }

        # Add deployment to queue
        deployment_queue.add_deployment(deployment_data)

        # Save initial deployment data to MongoDB
        mongodb_service.save_deployment({
            'deployment_id': deployment_id,
            'email': email,
            'status': 'queued',
            'created_at': time.time(),
            'request_data': str(deployment_data['request_data'])
        })

        logger.info(f"Deployment {deployment_id} queued successfully")
        return jsonify({
            'message': 'Deployment request received and queued',
            'deployment_id': deployment_id,
            'status': 'queued'
        })

    except Exception as e:
        logger.error(f"Error processing deployment request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployments', methods=['GET'])
@REQUEST_LATENCY.time()
def list_all_deployments():
    """List all deployments with optional filtering"""
    REQUEST_COUNT.labels(method='GET', endpoint='/deployments').inc()
    try:
        # Get optional email filter from query params
        email = request.args.get('email')
        
        # Get deployments from MongoDB
        deployments = mongodb_service.get_all_deployments(email)
        
        return jsonify({
            'deployments': deployments,
            'count': len(deployments)
        })

    except Exception as e:
        logger.error(f"Error retrieving deployments: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployments/user/<email>', methods=['GET'])
@REQUEST_LATENCY.time()
def get_user_deployments(email):
    """Get all deployments for a specific user"""
    REQUEST_COUNT.labels(method='GET', endpoint='/deployments/user').inc()
    try:
        deployments = mongodb_service.get_user_deployments(email)
        return jsonify({
            'email': email,
            'deployments': deployments,
            'count': len(deployments)
        })

    except Exception as e:
        logger.error(f"Error retrieving user deployments: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployment/<deployment_id>/status', methods=['GET'])
@REQUEST_LATENCY.time()
def get_deployment_status(deployment_id):
    REQUEST_COUNT.labels(method='GET', endpoint='/deployment/status').inc()
    try:
        # Get status from queue service
        queue_status = deployment_queue.get_deployment_status(deployment_id)
        
        # Get detailed status from MongoDB
        db_status = mongodb_service.get_deployment(deployment_id)
        
        if queue_status['status'] == 'not_found' and not db_status:
            logger.warning(f"Deployment not found: {deployment_id}")
            return jsonify({'error': 'Deployment not found'}), 404

        # Combine status information
        status = {**queue_status, **(db_status or {})}
        logger.info(f"Retrieved status for deployment {deployment_id}: {status['status']}")
        return jsonify(status)

    except Exception as e:
        logger.error(f"Error retrieving deployment status: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Start Prometheus metrics server on port 8000
    start_http_server(8000)
    # Start Flask app on port 5000
    logger.info("Starting Flask app on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)