from src.config import Config

class PortManager:
    def __init__(self):
        self.deployments = {}
        self.port_range = range(Config.PORT_RANGE_START, Config.PORT_RANGE_END)

    def get_available_port(self):
        used_ports = set(self.deployments.values())
        for port in self.port_range:
            if port not in used_ports:
                return port
        raise Exception("No ports available")

    def assign_port(self, deployment_id, port):
        self.deployments[deployment_id] = port

    def release_port(self, deployment_id):
        if deployment_id in self.deployments:
            del self.deployments[deployment_id]

    def get_port(self, deployment_id):
        return self.deployments.get(deployment_id)

    def deployment_exists(self, deployment_id):
        return deployment_id in self.deployments

    def get_all_deployments(self):
        return self.deployments