import docker
from src.config import Config
from src.utils.dockerfile_generator import DockerfileGenerator

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
        # Create container with host networking
        container = self.client.containers.run(
            image_id,
            detach=True,
            network_mode="host",  # Use host networking
            ports={f"{port}/tcp": port},  # Map container port to same host port
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
        return f"{Config.DEPLOYMENT_URL}:{port}"

    def get_container_stats(self, container):
        stats = container.stats(stream=False)
        return {
            'cpu_usage': stats['cpu_stats']['cpu_usage']['total_usage'],
            'memory_usage': stats['memory_stats']['usage'],
            'network_rx': stats['networks']['eth0']['rx_bytes'],
            'network_tx': stats['networks']['eth0']['tx_bytes']
        }