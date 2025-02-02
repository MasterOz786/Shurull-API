from flask import Flask, request, jsonify
from flask_cors import CORS
import docker
import git
import os
import socket
import uuid
import zipfile
from werkzeug.utils import secure_filename
from prometheus_client import start_http_server, Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
import yagmail
from config import Config
from logger import setup_logger
from queue_service import DeploymentQueue
from mongodb_service import MongoDBService

# Configure logging
logger = setup_logger(__name__)

app = Flask(__name__)
CORS(app, origins=['https://shurulls.pro', '*'])

# Initialize services
deployment_queue = DeploymentQueue()
mongodb_service = MongoDBService()

# Email configuration
ADMIN_EMAIL = "khawajaaltaf.ka@gmail.com"
EMAIL_PASSWORD = os.getenv('ygxq hteq pwlx wlen', '')  # Set this in your environment variables

# Initialize email client
yag = yagmail.SMTP(ADMIN_EMAIL, EMAIL_PASSWORD)

# Prometheus metrics
REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('api_request_latency_seconds', 'API request latency')

def send_email_notification(to_email, subject, content):
    try:
        yag.send(to=to_email, subject=subject, contents=content)
        logger.info(f"Email notification sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")

@app.route('/deployments', methods=['GET'])
@REQUEST_LATENCY.time()
def get_deployments():
    """Get all deployments"""
    REQUEST_COUNT.labels(method='GET', endpoint='/deployments').inc()
    try:
        deployments = mongodb_service.get_all_deployments()
        return jsonify({
            'deployments': deployments,
            'count': len(deployments)
        })
    except Exception as e:
        logger.error(f"Error retrieving deployments: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deploy', methods=['POST'])
@REQUEST_LATENCY.time()
def deploy():
    REQUEST_COUNT.labels(method='POST', endpoint='/deploy').inc()
    try:
        # Validate request
        if not request.json or 'email' not in request.json:
            return jsonify({'error': 'Email is required'}), 400

        email = request.json['email']
        deployment_id = str(uuid.uuid4())
        logger.info(f"Received deployment request with ID: {deployment_id} for user: {email}")

        deployment_data = {
            'deployment_id': deployment_id,
            'email': email,
            'request_data': request.files if request.files else request.json,
            'status': 'pending',  # Set initial status as pending
            'created_at': time.time()
        }

        # Save deployment data to MongoDB
        mongodb_service.save_deployment(deployment_data)

        logger.info(f"Deployment {deployment_id} saved with pending status")
        return jsonify({
            'message': 'Deployment request received and pending approval',
            'deployment_id': deployment_id,
            'status': 'pending'
        })

    except Exception as e:
        logger.error(f"Error processing deployment request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployment/<deployment_id>/approve', methods=['POST'])
def approve_deployment(deployment_id):
    try:
        deployment = mongodb_service.get_deployment(deployment_id)
        if not deployment:
            return jsonify({'error': 'Deployment not found'}), 404

        if deployment.get('status') != 'pending':
            return jsonify({'error': 'Deployment is not in pending state'}), 400

        # Add deployment to queue for processing
        deployment_queue.add_deployment(deployment)

        # Update deployment status
        mongodb_service.update_deployment_status(deployment_id, {
            'status': 'approved',
            'approved_at': time.time()
        })

        # Send email notification
        user_email = deployment.get('email')
        if user_email:
            subject = "Your API Deployment Request has been Approved"
            content = f"""
            Hello,

            Your API deployment request (ID: {deployment_id}) has been approved!
            Your API will be deployed shortly.

            Best regards,
            Shurull API Team
            """
            send_email_notification(user_email, subject, content)

        return jsonify({'message': 'Deployment approved successfully'})

    except Exception as e:
        logger.error(f"Error approving deployment: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/deployment/<deployment_id>/reject', methods=['POST'])
def reject_deployment(deployment_id):
    try:
        deployment = mongodb_service.get_deployment(deployment_id)
        if not deployment:
            return jsonify({'error': 'Deployment not found'}), 404

        if deployment.get('status') != 'pending':
            return jsonify({'error': 'Deployment is not in pending state'}), 400

        # Update deployment status
        mongodb_service.update_deployment_status(deployment_id, {
            'status': 'rejected',
            'rejected_at': time.time()
        })

        # Send email notification
        user_email = deployment.get('email')
        if user_email:
            subject = "Your API Deployment Request has been Rejected"
            content = f"""
            Hello,

            Unfortunately, your API deployment request (ID: {deployment_id}) has been rejected.
            If you believe this is a mistake, please contact our support team.

            Best regards,
            Shurull API Team
            """
            send_email_notification(user_email, subject, content)

        return jsonify({'message': 'Deployment rejected successfully'})

    except Exception as e:
        logger.error(f"Error rejecting deployment: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Start Prometheus metrics server on port 8000
    start_http_server(8000)
    # Start Flask app on port 5000
    logger.info("Starting Flask app on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)