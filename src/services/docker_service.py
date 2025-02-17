import docker
from src.config import Config
from src.utils.dockerfile_generator import DockerfileGenerator
import socket

class DockerService:
    def __init__(self):
        self.client = docker.from_env()
        self.dockerfile_generator = DockerfileGenerator()

    def build_image(self, project_path, deployment_id):
        # Generate appropriate Dockerfile based on project
        self.dockerfile_generator.generate(project_path)
        
        image, _ = self.client.images.build(
            path=project_path,
            tag=f"api-deployment-{deployment_id}",
            rm=True
        )
        return image

    def run_container(self, image_id, deployment_id, port):
        # Create container with proper port mapping
        container = self.client.containers.run(
            image_id,
            detach=True,
            network="bridge",  # Use bridge networking instead of host
            ports={f"{port}/tcp": str(port)},  # Explicitly convert port to string
            name=f"api-deployment-{deployment_id}",
            environment={
                "PORT": str(port),  # Pass port to container
                "PROMETHEUS_MULTIPROC_DIR": "/tmp",
                "prometheus_multiproc_dir": "/tmp"
            }
        )
        return container

    def get_container_url(self, deployment_id, port):
        """Generate the public URL for the deployed container"""
        # Get the host's IP address
        host_ip = socket.gethostbyname(socket.gethostname())
        return f"http://{host_ip}:{port}"

    def get_container_stats(self, container):
        stats = container.stats(stream=False)
        network_stats = stats.get('networks', {}).get('eth0', {
            'rx_bytes': 0,
            'tx_bytes': 0
        })
        
        return {
            'cpu_usage': stats['cpu_stats']['cpu_usage']['total_usage'],
            'memory_usage': stats['memory_stats']['usage'],
            'network_rx': network_stats['rx_bytes'],
            'network_tx': network_stats['tx_bytes']
        }

    def verify_container_connectivity(self, deployment_id, port):
        """Verify container connectivity and port mapping"""
        try:
            container = self.client.containers.get(f"api-deployment-{deployment_id}")
            container_info = container.attrs
            
            # Check if container is running
            if container.status != "running":
                return False, "Container is not running"
            
            # Verify port mapping
            port_bindings = container_info['NetworkSettings']['Ports']
            if f"{port}/tcp" not in port_bindings:
                return False, f"Port {port} is not mapped"
                
            return True, "Container is running and port is properly mapped"
        except Exception as e:
            return False, str(e)