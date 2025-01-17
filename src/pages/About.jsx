import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            About Shurull API
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          Empowering developers with seamless API deployment and management
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <h3 className="relative text-2xl font-semibold mb-4 text-white">Our Mission</h3>
          <p className="relative text-gray-300 leading-relaxed">
            At Shurull API, we're committed to simplifying the API deployment process for developers.
            Our platform provides a robust, scalable solution that allows teams to focus on building
            great APIs without worrying about infrastructure management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <h3 className="relative text-2xl font-semibold mb-4 text-white">Why Choose Us</h3>
          <ul className="relative space-y-4 text-gray-300">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h3 className="text-2xl font-semibold mb-8 text-center text-white">Our Technology Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-lg border border-gray-800/50 hover:border-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h4 className="relative font-semibold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
                {tech.name}
              </h4>
              <p className="relative text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  'Instant deployment with GitHub integration',
  'Real-time monitoring and analytics',
  'Automatic scaling and load balancing',
  'Comprehensive API documentation',
  '24/7 system monitoring and support'
];

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