import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ServerIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Monitoring() {
  const { id } = useParams();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`http://15.235.184.251:5000/deployment/${id}/status`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Deployment Metrics
          </h1>
          <button
            onClick={fetchMetrics}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Status"
            value={metrics.status}
            icon={ServerIcon}
            color="purple"
          />
          <MetricCard
            title="Port"
            value={metrics.port || 'N/A'}
            icon={ChartBarIcon}
            color="blue"
          />
          <MetricCard
            title="Uptime"
            value={metrics.uptime || 'N/A'}
            icon={ClockIcon}
            color="green"
          />
          <MetricCard
            title="Memory Usage"
            value={formatBytes(metrics.stats?.memory_usage || 0)}
            icon={ChartBarIcon}
            color="pink"
          />
        </div>

        {metrics.stats && (
          <div className="mt-8 bg-gray-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400 mb-2">CPU Usage</h3>
                <div className="text-lg">{formatCPU(metrics.stats.cpu_usage)}</div>
              </div>
              <div>
                <h3 className="text-gray-400 mb-2">Network I/O</h3>
                <div className="space-y-2">
                  <div>↓ {formatBytes(metrics.stats.network_rx)}</div>
                  <div>↑ {formatBytes(metrics.stats.network_tx)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    pink: 'from-pink-400 to-pink-600'
  };

  return (
    <div className="bg-gray-700/50 rounded-lg p-6 backdrop-blur-lg border border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatCPU(usage) {
  return `${((usage / 1e9) * 100).toFixed(2)}%`;
}