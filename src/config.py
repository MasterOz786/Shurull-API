import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    EXTRACT_FOLDER = 'extracted'
    PORT_RANGE_START = 3000
    PORT_RANGE_END = 4000
    
    # Create required directories
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(EXTRACT_FOLDER, exist_ok=True)

    # Monitoring config
    PROMETHEUS_PORT = 9090
    GRAFANA_PORT = 3000