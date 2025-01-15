# Shurull API System Architecture

## System Components

### 1. API Platform (Flask Application)
- **Purpose**: Main application handling API deployments
- **Location**: Port 5000
- **Key Functions**:
  - Project upload handling
  - Docker container management
  - Port management
  - Metrics collection

### 2. Prometheus
- **Purpose**: Metrics collection
- **Location**: Port 9090
- **Collects**:
  - Request metrics
  - Container metrics
  - System metrics
  - Custom business metrics

### 3. Grafana
- **Purpose**: Metrics visualization
- **Location**: Port 3000
- **Features**:
  - Customizable dashboards
  - Alerting
  - Metric analysis

### 4. Elasticsearch
- **Purpose**: Log storage and indexing
- **Location**: Port 9200
- **Stores**:
  - Application logs
  - Container logs
  - System events

### 5. Kibana
- **Purpose**: Log visualization and analysis
- **Location**: Port 5601
- **Features**:
  - Log search
  - Log visualization
  - Debug information

### 6. Filebeat
- **Purpose**: Log shipping
- **Features**:
  - Container log collection
  - Log preprocessing
  - Metadata enrichment

## Directory Structure
```
/home/ubuntu/shurull-api/
├── src/
│   ├── services/
│   │   └── docker_service.py
│   ├── utils/
│   │   ├── dockerfile_generator.py
│   │   └── port_manager.py
│   └── routes/
│       └── deployments.py
├── docs/
│   ├── API.md
│   └── SYSTEM.md
├── docker-compose.yml
├── filebeat.yml
├── prometheus.yml
└── requirements.txt
```

## Deployment Process

1. **Project Upload**
   - Receive ZIP/GitHub URL
   - Extract/clone project
   - Detect project type

2. **Container Creation**
   - Generate Dockerfile
   - Build image
   - Assign port
   - Start container

3. **Monitoring Setup**
   - Register metrics
   - Configure logging
   - Start collection

## Debugging Guide

### 1. Application Issues
```bash
# Check API logs
docker logs shurull-api_api_1

# Check application metrics
curl http://15.235.184.251:5000/metrics
```

### 2. Container Issues
```bash
# List running containers
docker ps

# Check container logs
docker logs api-deployment-{id}

# Check container stats
docker stats api-deployment-{id}
```

### 3. Monitoring Issues
```bash
# Check Prometheus targets
curl http://15.235.184.251:9090/targets

# Check Elasticsearch health
curl http://15.235.184.251:9200/_cluster/health
```

### 4. Common Problems

#### Container Won't Start
1. Check logs in Kibana
2. Verify port availability
3. Check resource constraints

#### High Resource Usage
1. Monitor Grafana dashboards
2. Check container stats
3. Review application logs

#### Deployment Failures
1. Check API response
2. Review Kibana logs
3. Verify project structure