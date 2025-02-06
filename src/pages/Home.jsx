import { memo, useMemo, lazy, Suspense } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

// Lazy loaded components
const StatsCard = lazy(() => import('./components/StatsCard'));
const FeatureCard = lazy(() => import('./components/FeatureCard'));

// Constants moved outside component
const ANIMATION_SEQUENCE = [
  'Deploy in seconds',
  2000,
  'Monitor in real-time',
  2000,
  'Scale automatically',
  2000
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '150ms', label: 'Avg. Latency' },
  { value: '24/7', label: 'Support' },
  { value: '5', label: 'APIs Deployed' }
];

const features = [
  {
    name: 'Instant Deployment',
    description: 'Push your code and watch it go live in seconds. Support for both GitHub repositories and ZIP uploads.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Real-time Monitoring',
    description: 'Track performance metrics, usage patterns, and system health with detailed analytics.',
    icon: ChartBarIcon,
  },
  {
    name: 'Auto-scaling',
    description: 'Your APIs automatically scale based on demand, ensuring optimal performance at all times.',
    icon: BoltIcon,
  }
];

export default function Home() {
  // Memoize static content
  const backgroundBlobs = useMemo(() => (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>
  ), []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-hidden">
        {backgroundBlobs}

        {/* Hero Section */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
                  Deploy APIs
                </span>
                <br />
                <span className="text-white">
                  Without Limits
                </span>
              </h1>
              
              <div className="mt-8 text-xl sm:text-2xl text-gray-400 font-light h-20">
                <TypeAnimation
                  sequence={ANIMATION_SEQUENCE}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>

              <motion.div 
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/deploy"
                  className="inline-flex items-center px-8 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-0 shadow-lg"
                >
                  Start Deploying
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-4 rounded-xl text-base font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 focus:ring-0"
                >
                  Learn More
                </a>
              </motion.div>

              {/* Stats Section */}
              <Suspense fallback={null}>
                <motion.div
                  className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                  ))}
                </motion.div>
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Built for developers who want to focus on code, not infrastructure
              </p>
            </motion.div>

            <Suspense fallback={null}>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>

        {/* CTA Section - Reduced Spacing */}
        <div className="relative z-10 py-12 bg-gradient-to-b from-transparent to-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Join developers who trust Shurull API for their deployment needs
              </p>
              <Link
                to="/deploy"
                className="inline-flex items-center px-8 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-0 shadow-lg"
              >
                Deploy Your First API
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}