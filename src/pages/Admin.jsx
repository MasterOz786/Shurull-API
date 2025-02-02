import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // Refresh requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://15.235.184.251:5000/deployments');
      const data = await response.json();
      setRequests(data.deployments || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch deployment requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (deploymentId, action) => {
    try {
      const response = await fetch(`http://15.235.184.251:5000/deployment/${deploymentId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} deployment`);
      }

      toast.success(`Deployment ${action}ed successfully`);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      completed: 'bg-blue-500'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Admin Dashboard
        </h1>

        <div className="space-y-6">
          {requests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No deployment requests</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.deployment_id}
                className="bg-gray-700/50 rounded-lg p-6 backdrop-blur-lg border border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Deployment Request: {request.deployment_id}
                    </h3>
                    <p className="text-gray-300 mt-1">Email: {request.email}</p>
                    <p className="text-gray-400 mt-1">
                      Submitted: {new Date(request.created_at * 1000).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      Status: {getStatusBadge(request.status)}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAction(request.deployment_id, 'approve')}
                        className="flex items-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request.deployment_id, 'reject')}
                        className="flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}