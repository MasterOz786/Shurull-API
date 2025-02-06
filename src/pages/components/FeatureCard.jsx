import { memo } from 'react';
import { motion } from 'framer-motion';

const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    className="relative group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
  >
    <div className="h-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/30 group">
      <div className="flex items-center mb-4">
        <feature.icon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <h3 className="text-xl font-semibold text-white ml-3">{feature.name}</h3>
      </div>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
    </div>
  </motion.div>
));

export default FeatureCard;