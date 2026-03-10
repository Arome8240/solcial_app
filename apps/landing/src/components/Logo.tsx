'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 64, className = '' }: LogoProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8
      }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        style={{ width: size, height: size }}
        className="relative"
      >
        {/* Outer circle with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-600 to-blue-600 rounded-full" />
        
        {/* Inner design */}
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-full h-full p-3"
          >
            {/* Lightning bolt representing speed and energy */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M50 10 L30 45 H50 L40 90 L70 55 H50 L60 10 Z"
              fill="url(#gradient)"
              stroke="url(#gradient)"
              strokeWidth="2"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Animated ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-4 border-purple-400 rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}
