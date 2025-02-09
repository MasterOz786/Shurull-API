from queue import Queue
from threading import Thread, Lock
import time
from datetime import datetime
import os
import docker
import git
import zipfile
from werkzeug.utils import secure_filename
from dockerfile_generator import DockerfileGenerator
from logger import setup_logger
from mongodb_service import MongoDBService

logger = setup_logger(__name__)

class DeploymentQueue:
    def __init__(self):
        self.queue = Queue()
        self.processing = False
        self.lock = Lock()
        self.current_deployments = {}
        self.docker_client = docker.from_env()
        self.dockerfile_generator = DockerfileGenerator()
        self.mongodb_service = MongoDBService()
        self.upload_folder = 'uploads'
        self.extract_folder = 'extracted'
        self._start_worker()
        logger.info("Deployment queue initialized")

    def _start_worker(self):
        self.processing = True
        worker = Thread(target=self._process_queue)
        worker.daemon = True
        worker.start()
        logger.info("Queue worker thread started")

    def add_deployment(self, deployment_data):
        deployment_id = deployment_data.get('deployment_id')
        status_data = {
            'status': 'queued',
            'queued_at': datetime.now().isoformat(),
            'started_at': None,
            'completed_at': None,
            'error': None,
            'port': None
        }
        
        self.current_deployments[deployment_id] = status_data
        self.queue.put(deployment_data)
        
        # Update MongoDB with initial status
        self.mongodb_service.update_deployment_status(deployment_id, status_data)
        
        logger.info(f"Added deployment {deployment_id} to queue")
        return deployment_id

    def get_deployment_status(self, deployment_id):
        status = self.current_deployments.get(deployment_id, {'status': 'not_found'})
        logger.debug(f"Retrieved status for deployment {deployment_id}: {status}")
        return status

    def _handle_file_upload(self, file, deployment_id):
        if not file:
            raise ValueError("No file provided")
        
        filename = secure_filename(file.filename)
        zip_path = os.path.join(self.upload_folder, filename)
        extract_path = os.path.join(self.extract_folder, deployment_id)
        
        logger.info(f"Processing file upload for deployment {deployment_id}")
        
        os.makedirs(extract_path, exist_ok=True)
        file.save(zip_path)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        os.remove(zip_path)
        logger.info(f"File extracted successfully for deployment {deployment_id}")
        return extract_path

    def _handle_github_repo(self, repo_url, deployment_id):
        if not repo_url:
            raise ValueError("No repository URL provided")
        
        extract_path = os.path.join(self.extract_folder, deployment_id)
        logger.info(f"Cloning repository for deployment {deployment_id}: {repo_url}")
        
        git.Repo.clone_from(repo_url, extract_path)
        logger.info(f"Repository cloned successfully for deployment {deployment_id}")
        return extract_path

    def _build_and_run_container(self, project_path, deployment_id, port):
        logger.info(f"Building container for deployment {deployment_id}")
        
        # Generate Dockerfile based on project type
        self.dockerfile_generator.generate(project_path)
        
        # Build Docker image
        image, _ = self.docker_client.images.build(
            path=project_path,
            tag=f"api-deployment-{deployment_id}",
            rm=True
        )
        
        logger.info(f"Docker image built successfully for deployment {deployment_id}")
        
        # Run container
        container = self.docker_client.containers.run(
            image.id,
            detach=True,
            ports={f'{port}/tcp': port},
            name=f"api-deployment-{deployment_id}",
            environment={
                "PROMETHEUS_MULTIPROC_DIR": "/tmp",
                "prometheus_multiproc_dir": "/tmp"
            }
        )
        
        logger.info(f"Container started successfully for deployment {deployment_id} on port {port}")
        return container

    def _find_available_port(self, start_port=3000, end_port=4000):
        logger.debug("Searching for available port")
        used_ports = set()
        for container in self.docker_client.containers.list():
            if container.ports:
                for mappings in container.ports.values():
                    if mappings is not None:
                        for mapping in mappings:
                            used_ports.add(int(mapping['HostPort']))
                            
        for port in range(start_port, end_port + 1):
            if port not in used_ports:
                logger.info(f"Found available port: {port}")
                return port
        logger.error("No available ports in the specified range")
        
    def _process_queue(self):
        while self.processing:
            try:
                if not self.queue.empty():
                    with self.lock:
                        deployment_data = self.queue.get()
                        deployment_id = deployment_data.get('deployment_id')
                        request_data = deployment_data.get('request_data', {})
                        
                        logger.info(f"Processing deployment {deployment_id}")
                        
                        # Update status to processing
                        status_update = {
                            'status': 'processing',
                            'started_at': datetime.now().isoformat()
                        }
                        self.current_deployments[deployment_id].update(status_update)
                        self.mongodb_service.update_deployment_status(deployment_id, status_update)

                        try:
                            # Handle project files
                            if 'file' in request_data:
                                project_path = self._handle_file_upload(request_data['file'], deployment_id)
                            elif 'repository' in request_data:
                                project_path = self._handle_github_repo(request_data['repository'], deployment_id)
                            else:
                                raise ValueError("No file or repository provided")

                            # Find available port
                            port = self._find_available_port()
                            
                            # Build and run container
                            container = self._build_and_run_container(project_path, deployment_id, port)
                            
                            # Update status to completed
                            status_update = {
                                'status': 'completed',
                                'completed_at': datetime.now().isoformat(),
                                'port': port,
                                'container_id': container.id
                            }
                            self.current_deployments[deployment_id].update(status_update)
                            self.mongodb_service.update_deployment_status(deployment_id, status_update)
                            
                            logger.info(f"Deployment {deployment_id} completed successfully on port {port}")
                            
                        except Exception as e:
                            error_msg = str(e)
                            logger.error(f"Error processing deployment {deployment_id}: {error_msg}")
                            
                            status_update = {
                                'status': 'failed',
                                'error': error_msg,
                                'completed_at': datetime.now().isoformat()
                            }
                            self.current_deployments[deployment_id].update(status_update)
                            self.mongodb_service.update_deployment_status(deployment_id, status_update)

                        self.queue.task_done()
                else:
                    time.sleep(1)  # Prevent CPU spinning when queue is empty
                    
            except Exception as e:
                logger.error(f"Queue processing error: {str(e)}")
                time.sleep(1)  # Prevent rapid retries on persistent errors

    def cleanup_deployment(self, deployment_id):
        """Clean up deployment resources"""
        try:
            logger.info(f"Starting cleanup for deployment {deployment_id}")
            
            # Stop and remove container
            container = self.docker_client.containers.get(f"api-deployment-{deployment_id}")
            container.stop()
            container.remove()
            
            # Remove project files
            project_path = os.path.join(self.extract_folder, deployment_id)
            if os.path.exists(project_path):
                import shutil
                shutil.rmtree(project_path)
            
            # Remove from MongoDB
            self.mongodb_service.delete_deployment(deployment_id)
            
            # Remove deployment from tracking
            if deployment_id in self.current_deployments:
                del self.current_deployments[deployment_id]
            
            logger.info(f"Cleanup completed for deployment {deployment_id}")
                
        except Exception as e:
            logger.error(f"Error cleaning up deployment {deployment_id}: {str(e)}")
            raise