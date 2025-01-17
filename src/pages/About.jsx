import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          About Shurull API
        </h2>
        <p className="mt-4 text-xl text-gray-300">
          Empowering developers with seamless API deployment and management
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-300">
            At Shurull API, we're committed to simplifying the API deployment process for developers.
            Our platform provides a robust, scalable solution that allows teams to focus on building
            great APIs without worrying about infrastructure management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-semibold mb-4">Why Choose Us</h3>
          <ul className="space-y-4 text-gray-300">
            <li>• Instant deployment with GitHub integration</li>
            <li>• Real-time monitoring and analytics</li>
            <li>• Automatic scaling and load balancing</li>
            <li>• Comprehensive API documentation</li>
            <li>• 24/7 system monitoring and support</li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <h3 className="text-2xl font-semibold mb-6">Our Technology Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-lg border border-gray-700"
            >
              <h4 className="font-semibold text-purple-400">{tech.name}</h4>
              <p className="text-sm text-gray-400 mt-2">{tech.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const technologies = [
  {
    name: 'Docker',
    description: 'Container orchestration',
  },
  {
    name: 'Prometheus',
    description: 'Metrics & monitoring',
  },
  {
    name: 'Grafana',
    description: 'Visualization',
  },
  {
    name: 'Node.js',
    description: 'Runtime environment',
  },
];