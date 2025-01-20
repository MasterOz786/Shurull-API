import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Application directories
    UPLOAD_FOLDER = 'uploads'
    EXTRACT_FOLDER = 'extracted'
    PORT_RANGE_START = 3000
    PORT_RANGE_END = 4000
    
    # Create required directories
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(EXTRACT_FOLDER, exist_ok=True)

    # MongoDB configuration
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    MONGODB_DB = os.getenv('MONGODB_DB', 'shurull_api')
    
    # Logging configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Monitoring config
    PROMETHEUS_PORT = 9090
    GRAFANA_PORT = 3000