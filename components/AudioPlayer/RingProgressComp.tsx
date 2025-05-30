import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RingProgressProps {
  audiobook: {
    poster: string;
    [key: string]: any;
  };
  currentPercentage: number;
}

const RingProgressComp = ({ audiobook, currentPercentage }: RingProgressProps) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

  return (
    <div className="w-full flex justify-center items-center mb-4">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-110 animate-pulse" />

        {/* SVG Ring */}
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Foreground ring */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          {/* Audiobook Poster */}
          <motion.div
            className="absolute inset-4 md:inset-6 rounded-full overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full z-0" />
            <Image
              src={audiobook.poster}
              alt="Book cover"
              width={500}
              height={500}
              className="w-full h-full object-cover rounded-full border-4 border-emerald-500/30 relative z-10"
            />
          </motion.div>

          {/* Percentage Text */}
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-black backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30">
              <span className="text-emerald-300 text-sm font-bold">
                {Math.round(currentPercentage)}%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RingProgressComp;
