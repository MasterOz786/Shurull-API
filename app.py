from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import git
import os
import socket
import uuid
import zipfile
import psutil
from werkzeug.utils import secure_filename
from prometheus_client import start_http_server, Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=['https://shurull.pro', '*'])
client = docker.from_env()

# Configuration
UPLOAD_FOLDER = 'uploads'
EXTRACT_FOLDER = 'extracted'
PORT_RANGE_START = 3000
PORT_RANGE_END = 4000
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACT_FOLDER, exist_ok=True)

# Store running containers and their ports
deployments = {}

# Prometheus metrics
REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('api_request_latency_seconds', 'API request latency')

@app.route('/metrics')
def metrics():
    """Expose Prometheus metrics."""
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

def find_available_port(start_port=PORT_RANGE_START, end_port=PORT_RANGE_END):
    """Find the next available port in the range."""
    for port in range(start_port, end_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except OSError:
            continue
    raise Exception("No available ports in the specified range")

@app.route('/deploy', methods=['POST'])
@REQUEST_LATENCY.time()
def deploy():
    REQUEST_COUNT.labels(method='POST', endpoint='/deploy').inc()
    try:
        deployment_id = str(uuid.uuid4())
        extract_path = os.path.join(EXTRACT_FOLDER, deployment_id)
        os.makedirs(extract_path, exist_ok=True)

        logger.info(f"Starting deployment with ID: {deployment_id}")

        if 'file' in request.files:
            file = request.files['file']
            if file.filename.endswith('.zip'):
                zip_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
                logger.info(f"Saving and extracting ZIP file: {file.filename}")
                file.save(zip_path)
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_path)
                os.remove(zip_path)
        elif 'repository' in request.json:
            repo_url = request.json['repository']
            logger.info(f"Cloning repository: {repo_url}")
            git.Repo.clone_from(repo_url, extract_path)
        else:
            logger.error("No file or repository provided")
            return jsonify({'error': 'No file or repository provided'}), 400

        # Find an available port
        port = find_available_port()
        logger.info(f"Building Docker image for deployment ID: {deployment_id}")
        image, logs = client.images.build(
            path=extract_path,
            tag=f"api-deployment-{deployment_id}",
            rm=True
        )
        for log in logs:
            logger.info(f"Build log: {log.get('stream', '')}")

        logger.info(f"Starting container for deployment ID: {deployment_id} on port: {port}")
        container = client.containers.run(
            image.id,
            detach=True,
            ports={'5001/tcp': port},  # Map container port 5001 to the unique host port
            name=f"api-deployment-{deployment_id}"
        )

        deployments[deployment_id] = port

        logger.info(f"Deployment successful! Deployment ID: {deployment_id}, Port: {port}")
        return jsonify({
            'deployment_id': deployment_id,
            'port': port,
            'status': 'running'
        })

    except Exception as e:
        logger.error(f"Deployment failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployments', methods=['GET'])
def list_deployments():
    REQUEST_COUNT.labels(method='GET', endpoint='/deployments').inc()
    if (len(deployments) == 0):
        logger.info("No deployments found")
        return jsonify({'info': 'No deployments found'}), 204
    
    logger.info("Listing all deployments")
    return jsonify(deployments)

@app.route('/deployment/<deployment_id>', methods=['GET'])
def get_deployment(deployment_id):
    REQUEST_COUNT.labels(method='GET', endpoint='/deployment').inc()
    logger.info(f"Fetching details for deployment ID: {deployment_id}")
    if deployment_id not in deployments:
        logger.error(f"Deployment not found: {deployment_id}")
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = client.containers.get(f"api-deployment-{deployment_id}")
        stats = container.stats(stream=False)
        
        logger.info(f"Retrieved stats for deployment ID: {deployment_id}")
        return jsonify({
            'deployment_id': deployment_id,
            'port': deployments[deployment_id],
            'status': container.status,
            'stats': {
                'cpu_usage': stats['cpu_stats']['cpu_usage']['total_usage'],
                'memory_usage': stats['memory_stats']['usage'],
                'network_rx': stats['networks']['eth0']['rx_bytes'],
                'network_tx': stats['networks']['eth0']['tx_bytes']
            }
        })
    except Exception as e:
        logger.error(f"Error fetching deployment details: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployment/<deployment_id>', methods=['DELETE'])
def delete_deployment(deployment_id):
    REQUEST_COUNT.labels(method='DELETE', endpoint='/deployment').inc()
    logger.info(f"Deleting deployment ID: {deployment_id}")
    if deployment_id not in deployments:
        logger.error(f"Deployment not found: {deployment_id}")
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = client.containers.get(f"api-deployment-{deployment_id}")
        container.stop()
        container.remove()
        del deployments[deployment_id]
        logger.info(f"Deployment deleted: {deployment_id}")
        return jsonify({'status': 'deleted'})
    except Exception as e:
        logger.error(f"Error deleting deployment: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Start Prometheus metrics server on port 8000
    start_http_server(8000)
    # Start Flask app on port 5000
    logger.info("Starting Flask app on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)