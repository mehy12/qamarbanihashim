'use client'

import { motion } from 'framer-motion'

export default function AnimatedCheck() {
  return (
    <div className="flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle */}
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          stroke="#C8A45D"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.8, ease: 'easeInOut' },
            opacity: { duration: 0.1 },
          }}
        />
        {/* Checkmark */}
        <motion.path
          d="M24 42 L35 53 L56 28"
          stroke="#C8A45D"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.7, ease: 'easeInOut', delay: 0.8 },
            opacity: { duration: 0.1, delay: 0.8 },
          }}
        />
      </svg>
    </div>
  )
}
