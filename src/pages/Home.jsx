import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Shurull API Platform
          </motion.h1>
          
          <div className="mt-6 text-xl sm:text-2xl text-gray-300 h-20">
            <TypeAnimation
              sequence={[
                'Deploy APIs in seconds',
                2000,
                'Monitor performance effortlessly',
                2000,
                'Scale with confidence',
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <motion.div 
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/deploy"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div 
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-lg border border-gray-700"
              >
                <feature.icon className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Instant Deployment',
    description: 'Deploy your APIs with a single click. Support for both GitHub repositories and ZIP files.',
    icon: ArrowRightIcon,
  },
  {
    name: 'Real-time Monitoring',
    description: 'Monitor your API performance, usage, and health metrics in real-time.',
    icon: ArrowRightIcon,
  },
  {
    name: 'Automatic Scaling',
    description: 'Your APIs automatically scale based on demand, ensuring optimal performance.',
    icon: ArrowRightIcon,
  },
];