'use client'

import { motion } from 'framer-motion'
import AnimatedCheck from '../ui/AnimatedCheck'

interface ThankYouProps {
  amount: number
  name: string
}

export default function ThankYou({ amount, name }: ThankYouProps) {
  const vadapavCount = Math.floor(amount / 15)

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      {/* Animated Checkmark */}
      <AnimatedCheck />

      {/* JazakAllah */}
      <motion.h1
        className="text-3xl text-[#C8A45D] mt-8 text-center"
        style={{ fontFamily: 'var(--font-cinzel)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        JazakAllah Khair
      </motion.h1>

      {/* Donor Acknowledgment */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <p className="text-lg text-[#F5F1E8]">
          You have contributed ₹{amount.toLocaleString('en-IN')}
        </p>
        <p className="text-[#BFAF8A] text-sm mt-1">
          towards Sabeel-e-Imam Hussain (A.S.)
        </p>
      </motion.div>

      {/* Impact Box */}
      <motion.div
        className="bg-white/5 border border-[rgba(200,164,93,0.15)] rounded-2xl p-6 text-center mt-8 w-full max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6 }}
      >
        <p className="text-xs text-[#BFAF8A] uppercase tracking-wider mb-2">
          Approximate Impact
        </p>
        <p className="text-4xl text-[#C8A45D] font-semibold">{vadapavCount}</p>
        <p className="text-sm text-[#BFAF8A] mt-1">Vadapavs Sponsored</p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-xs text-[#BFAF8A] italic mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
      >
        Serving in the name of Hussain (A.S.)
      </motion.p>
    </div>
  )
}
