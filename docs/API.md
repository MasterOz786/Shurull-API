# Shurull API Documentation

## Overview

Shurull API is a platform that enables users to deploy their APIs (Node.js, Flask, etc.) automatically with containerization and monitoring capabilities. The platform handles deployment, monitoring, and management of user APIs through a simple REST interface.

## Base URL

```
http://15.235.184.251:5000
```

## Authentication

Currently, the API does not require authentication. This should be implemented in production.

## API Endpoints

### 1. Deploy API
**POST** `/deployments`

Deploy a new API from a ZIP file or GitHub repository.

#### Request Body
- Form Data:
  - `file`: ZIP file containing the API project
  OR
- JSON:
  ```json
  {
    "repository": "https://github.com/username/repo"
  }
  ```

#### Success Response
```json
{
  "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
  "port": 3000,
  "status": "running"
}
```
Status Code: 200

#### Error Response
```json
{
  "error": "No file or repository provided"
}
```
Status Code: 400

### 2. List Deployments
**GET** `/deployments`

Retrieve all active deployments.

#### Success Response
```json
{
  "550e8400-e29b-41d4-a716-446655440000": 3000,
  "660e8400-e29b-41d4-a716-446655440001": 3001
}
```
Status Code: 200

### 3. Get Deployment Details
**GET** `/deployments/{deployment_id}`

Get details and metrics for a specific deployment.

#### Success Response
```json
{
  "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
  "port": 3000,
  "status": "running",
  "stats": {
    "cpu_usage": 1234567,
    "memory_usage": 8912345,
    "network_rx": 1234,
    "network_tx": 5678
  }
}
```
Status Code: 200

#### Error Response
```json
{
  "error": "Deployment not found"
}
```
Status Code: 404

### 4. Delete Deployment
**DELETE** `/deployments/{deployment_id}`

Remove a deployment and stop its container.

#### Success Response
```json
{
  "status": "deleted"
}
```
Status Code: 200

#### Error Response
```json
{
  "error": "Deployment not found"
}
```
Status Code: 404

## Monitoring & Debugging

### Component Access

1. **Grafana Dashboard**
   - URL: `http://15.235.184.251:3000`
   - Default credentials: admin/admin
   - Metrics available:
     - API request counts
     - Response latencies
     - Container resources
     - Error rates

2. **Kibana Logs**
   - URL: `http://15.235.184.251:5601`
   - View detailed logs for:
     - API requests
     - Container logs
     - System events
     - Error traces

3. **Prometheus**
   - URL: `http://15.235.184.251:9090`
   - Raw metrics access
   - Query interface for custom metrics

### Debugging Tips

1. **Check Container Logs**
   ```bash
   docker logs api-deployment-{deployment_id}
   ```

2. **Monitor Resource Usage**
   ```bash
   docker stats api-deployment-{deployment_id}
   ```

3. **Check API Logs in Kibana**
   - Navigate to Kibana
   - Go to "Discover"
   - Select index pattern "filebeat-*"
   - Filter by container name

4. **Common Issues**
   - Port conflicts: Check port availability
   - Container fails to start: Check logs in Kibana
   - High resource usage: Monitor Grafana dashboards
   - Deployment errors: Check API response and logs