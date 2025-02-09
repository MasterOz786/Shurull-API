from flask import Blueprint, request, jsonify
from src.services.docker_service import DockerService
from src.utils.port_manager import PortManager
from src.utils.project_handler import ProjectHandler
from prometheus_client import Counter, Histogram
import time

deployments_bp = Blueprint('deployments', __name__)
docker_service = DockerService()
port_manager = PortManager()
project_handler = ProjectHandler()

# Prometheus metrics
request_count = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
request_latency = Histogram('api_request_latency_seconds', 'API request latency')

@deployments_bp.route('/deployments', methods=['POST'])
@request_latency.time()
def create_deployment():
    request_count.labels(method='POST', endpoint='/deployments').inc()
    
    try:
        deployment_id = project_handler.handle_upload(request)
        port = port_manager.get_available_port()
        
        # Build and run container
        image = docker_service.build_image(project_handler.get_project_path(deployment_id), deployment_id)
        container = docker_service.run_container(image.id, deployment_id, port)
        # Get the public URL for the container
        deployment_url = docker_service.get_container_url(deployment_id, port)
        port_manager.assign_port(deployment_id, port)
        
        return jsonify({
            'deployment_id': deployment_id,
            'port': port,   
            'url': deployment_url,
            'status': 'running'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deployments_bp.route('/deployments', methods=['GET'])
@request_latency.time()
def list_deployments():
    request_count.labels(method='GET', endpoint='/deployments').inc()
    return jsonify(port_manager.get_all_deployments())

@deployments_bp.route('/deployments/<deployment_id>', methods=['GET'])
@request_latency.time()
def get_deployment(deployment_id):
    request_count.labels(method='GET', endpoint='/deployments/<id>').inc()
    
    if not port_manager.deployment_exists(deployment_id):
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = docker_service.client.containers.get(f"api-deployment-{deployment_id}")
        port = port_manager.get_port(deployment_id)
        deployment_url = docker_service.get_container_url(deployment_id, port)
        stats = docker_service.get_container_stats(container)
        
        return jsonify({
            'deployment_id': deployment_id,
            'port': port_manager.get_port(deployment_id),
            'url': deployment_url,
            'status': container.status,
            'stats': stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deployments_bp.route('/deployments/<deployment_id>', methods=['DELETE'])
@request_latency.time()
def delete_deployment(deployment_id):
    request_count.labels(method='DELETE', endpoint='/deployments/<id>').inc()
    
    if not port_manager.deployment_exists(deployment_id):
        return jsonify({'error': 'Deployment not found'}), 404

    try:
        container = docker_service.client.containers.get(f"api-deployment-{deployment_id}")
        container.stop()
        container.remove()
        port_manager.release_port(deployment_id)
        project_handler.cleanup_deployment(deployment_id)
        return jsonify({'status': 'deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500