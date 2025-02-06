import { memo, useMemo } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  ChartBarIcon, 
  BoltIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

// Memoized animation variants
const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.1 } }
  }
};

// Memoized data
const missions = [
  { icon: CloudArrowUpIcon, text: 'Instant deployment with GitHub integration' },
  { icon: ChartBarIcon, text: 'Real-time monitoring and analytics' },
  { icon: BoltIcon, text: 'Automatic scaling and load balancing' },
  { icon: ShieldCheckIcon, text: 'Comprehensive API documentation' }
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '150ms', label: 'Avg. Latency' },
  { value: '24/7', label: 'Support' },
  { value: '5+', label: 'APIs Deployed' }
];

const techStack = [
  { name: 'Docker', description: 'Container Platform' },
  { name: 'Prometheus', description: 'Metrics Collection' },
  { name: 'Grafana', description: 'Data Visualization' },
  { name: 'Node.js', description: 'Runtime Environment' }
];

// Memoized components
const TechStackCard = memo(({ tech }) => (
  <motion.div
    variants={animations.fadeInUp}
    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative flex flex-col items-center space-y-2">
      <p className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">
        {tech.name}
      </p>
      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        {tech.description}
      </p>
    </div>
  </motion.div>
));

const StatCard = memo(({ stat }) => (
  <motion.div
    variants={animations.fadeInUp}
    className="text-center p-4"
  >
    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
      {stat.value}
    </div>
    <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
  </motion.div>
));

const MissionItem = memo(({ mission }) => (
  <motion.div
    variants={animations.fadeInUp}
    className="flex items-center space-x-3 text-gray-300"
  >
    <mission.icon className="h-5 w-5 text-purple-400 flex-shrink-0" />
    <span>{mission.text}</span>
  </motion.div>
));

export default function About() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-32 pb-20"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-indigo-800/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-gray-900/60 to-gray-900/80" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              {...animations.fadeInUp}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Built for Modern Developers
              </span>
            </motion.h1>
            <motion.p 
              {...animations.fadeInUp} 
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Transform your development workflow with our powerful API deployment platform. 
              Deploy faster, monitor smarter, and scale seamlessly with enterprise-grade tools and infrastructure.
            </motion.p>
          </div>
        </motion.div>

        {/* Mission Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={animations.fadeInUp}>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  At Shurull API, we're committed to simplifying the API deployment process for developers.
                  Our platform provides a robust, scalable solution that allows teams to focus on building
                  great APIs without worrying about infrastructure management.
                </p>
                <div className="space-y-4">
                  {missions.map((mission, index) => (
                    <MissionItem key={index} mission={mission} />
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                variants={animations.fadeInUp}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl transform rotate-3" />
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <StatCard key={index} stat={stat} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={animations.fadeInUp}
                className="text-3xl font-bold text-white mb-4"
              >
                Our Technology Stack
              </motion.h2>
              <motion.p 
                variants={animations.fadeInUp}
                className="text-gray-300 max-w-2xl mx-auto"
              >
                Powered by industry-leading technologies for maximum reliability and performance
              </motion.p>
            </motion.div>

            <motion.div
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {techStack.map((tech, index) => (
                <TechStackCard key={index} tech={tech} />
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}