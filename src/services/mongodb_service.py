from pymongo import MongoClient
from config import Config
from logger import setup_logger

logger = setup_logger(__name__)

class MongoDBService:
    def __init__(self):
        try:
            self.client = MongoClient(Config.MONGODB_URI)
            self.db = self.client[Config.MONGODB_DB]
            self.deployments = self.db.deployments
            # Create index on email field for faster queries
            self.deployments.create_index("email")
            logger.info("MongoDB connection established")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    def save_deployment(self, deployment_data):
        """Save deployment data to MongoDB"""
        try:
            result = self.deployments.insert_one(deployment_data)
            logger.info(f"Deployment saved to MongoDB with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logger.error(f"Failed to save deployment: {str(e)}")
            raise

    def update_deployment_status(self, deployment_id, status_data):
        """Update deployment status in MongoDB"""
        try:
            result = self.deployments.update_one(
                {"deployment_id": deployment_id},
                {"$set": status_data}
            )
            logger.info(f"Deployment status updated for ID: {deployment_id}")
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update deployment status: {str(e)}")
            raise

    def get_deployment(self, deployment_id):
        """Retrieve deployment data from MongoDB"""
        try:
            deployment = self.deployments.find_one({"deployment_id": deployment_id})
            if deployment:
                deployment['_id'] = str(deployment['_id'])  # Convert ObjectId to string
            return deployment
        except Exception as e:
            logger.error(f"Failed to retrieve deployment: {str(e)}")
            raise

    def get_all_deployments(self, email=None):
        """Retrieve all deployments, optionally filtered by email"""
        try:
            query = {"email": email} if email else {}
            deployments = list(self.deployments.find(query).sort("created_at", -1))
            # Convert ObjectId to string for JSON serialization
            for deployment in deployments:
                deployment['_id'] = str(deployment['_id'])
            return deployments
        except Exception as e:
            logger.error(f"Failed to retrieve deployments: {str(e)}")
            raise

    def get_user_deployments(self, email):
        """Retrieve all deployments for a specific user"""
        try:
            deployments = list(self.deployments.find({"email": email}).sort("created_at", -1))
            # Convert ObjectId to string for JSON serialization
            for deployment in deployments:
                deployment['_id'] = str(deployment['_id'])
            return deployments
        except Exception as e:
            logger.error(f"Failed to retrieve user deployments: {str(e)}")
            raise

    def delete_deployment(self, deployment_id):
        """Delete deployment data from MongoDB"""
        try:
            result = self.deployments.delete_one({"deployment_id": deployment_id})
            logger.info(f"Deployment deleted from MongoDB: {deployment_id}")
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Failed to delete deployment: {str(e)}")
            raise