from flask import Flask, request, jsonify
import docker
import git
import os
import uuid
import zipfile
import psutil
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
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

def find_available_port():
    """Find the next available port in the range"""
    used_ports = set(deployments.values())
    for port in range(PORT_RANGE_START, PORT_RANGE_END):
        if port not in used_ports:
            return port
    raise Exception("No ports available")

def extract_zip(zip_path, extract_path):
    """Extract uploaded zip file"""
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

def clone_repository(repo_url, extract_path):
    """Clone a git repository"""
    git.Repo.clone_from(repo_url, extract_path)

def build_and_run_container(project_path, deployment_id):
    """Build and run Docker container for the project"""
    # Build the image
    image, _ = client.images.build(
        path=project_path,
        tag=f"api-deployment-{deployment_id}",
        rm=True
    )

    # Get available port
    port = find_available_port()

    # Run the container
    container = client.containers.run(
        image.id,
        detach=True,
        ports={'8080/tcp': port},
        name=f"api-deployment-{deployment_id}"
    )

    return container, port

@app.route('/deploy', methods=['POST'])
def deploy():
    try:
        deployment_id = str(uuid.uuid4())
        extract_path = os.path.join(EXTRACT_FOLDER, deployment_id)
        os.makedirs(extract_path, exist_ok=True)

        if 'file' in request.files:
            # Handle ZIP file upload
            file = request.files['file']
            if file.filename.endswith('.zip'):
                zip_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
                file.save(zip_path)
                extract_zip(zip_path, extract_path)
                os.remove(zip_path)  # Clean up zip file
        elif 'repository' in request.json:
            # Handle Git repository
            repo_url = request.json['repository']
            clone_repository(repo_url, extract_path)
        else:
            return jsonify({'error': 'No file or repository provided'}), 400

        # Build and run container
        container, port = build_and_run_container(extract_path, deployment_id)
        
        # Store deployment info
        deployments[deployment_id] = port

        return jsonify({
            'deployment_id': deployment_id,
            'port': port,
            'status': 'running'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/deployments', methods=['GET'])
def list_deployments():
    return jsonify(deployments)

@app.route('/deployment/<deployment_id>', methods=['GET'])
def get_deployment(deployment_id):
    if deployment_id not in deployments:
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = client.containers.get(f"api-deployment-{deployment_id}")
        stats = container.stats(stream=False)
        
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
        return jsonify({'error': str(e)}), 500

@app.route('/deployment/<deployment_id>', methods=['DELETE'])
def delete_deployment(deployment_id):
    if deployment_id not in deployments:
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = client.containers.get(f"api-deployment-{deployment_id}")
        container.stop()
        container.remove()
        del deployments[deployment_id]
        return jsonify({'status': 'deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)