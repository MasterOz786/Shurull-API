import { memo } from 'react';

const StatsCard = memo(({ value, label }) => (
  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
      {value}
    </p>
    <p className="mt-2 text-sm text-gray-400">{label}</p>
  </div>
));

export default StatsCard;