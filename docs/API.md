# Shurull API Documentation

## Overview

Shurull API is a platform that enables users to deploy their APIs (Node.js, Flask, etc.) automatically with containerization and monitoring capabilities. The platform handles deployment, monitoring, and management of user APIs through a simple REST interface.

## Base URL

```
http://15.235.184.251:5000
```

## API Endpoints

### 1. Deploy API
**POST** `/deploy`

Queue a new API deployment from a ZIP file or GitHub repository.

#### Request Body
- JSON:
  ```json
  {
    "email": "user@example.com",
    "repository": "https://github.com/username/repo"
  }
  ```
  OR
- Form Data:
  - `email`: User's email address
  - `file`: ZIP file containing the API project

#### Success Response
```json
{
  "message": "Deployment request received and queued",
  "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}
```
Status Code: 200

### 2. List All Deployments
**GET** `/deployments`

Get all deployments, optionally filtered by email.

#### Query Parameters
- `email` (optional): Filter deployments by user email

#### Success Response
```json
{
  "deployments": [
    {
      "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "status": "completed",
      "created_at": 1705743600,
      "port": 3000
    }
  ],
  "count": 1
}
```
Status Code: 200

### 3. Get User Deployments
**GET** `/deployments/user/{email}`

Get all deployments for a specific user.

#### Success Response
```json
{
  "email": "user@example.com",
  "deployments": [
    {
      "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "created_at": 1705743600,
      "port": 3000
    }
  ],
  "count": 1
}
```
Status Code: 200

### 4. Get Deployment Status
**GET** `/deployment/{deployment_id}/status`

Get the current status of a queued deployment.

#### Success Response
```json
{
  "deployment_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "status": "queued|processing|completed|failed",
  "queued_at": "2024-01-20T10:00:00.000Z",
  "started_at": "2024-01-20T10:00:05.000Z",
  "completed_at": "2024-01-20T10:00:10.000Z",
  "error": null,
  "port": 3000
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