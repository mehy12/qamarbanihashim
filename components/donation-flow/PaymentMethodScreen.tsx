'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface PaymentMethodScreenProps {
  amount: number
  onNext: (method: 'upi' | 'bank' | 'cash') => void
  onBack: () => void
}

export default function PaymentMethodScreen({ amount, onNext, onBack }: PaymentMethodScreenProps) {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

  return (
    <motion.div
      className="min-h-dvh flex flex-col items-center px-6 py-12 relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
    >
      {/* Back Button */}
      <motion.button
        className="absolute top-8 left-6 text-[#BFAF8A] text-sm hover:text-[#C8A45D] transition-colors"
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        ← Back
      </motion.button>

      <div className="w-full flex flex-col items-center mt-12">
        {/* Title */}
        <motion.h2
          className="text-2xl font-semibold text-[#F5F1E8] mb-8"
          style={{ fontFamily: 'var(--font-cinzel)' }}
          {...fadeUp(0.1)}
        >
          Select Payment Method
        </motion.h2>

        <div className="w-full space-y-4">
          <motion.button
            className="w-full py-5 px-4 rounded-2xl border border-[#C8A45D]/30 bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/5 flex items-center justify-between group hover:border-[#C8A45D]/60 transition-all"
            onClick={() => onNext('upi')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.2)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C8A45D]/20 flex items-center justify-center text-2xl">
                📱
              </div>
              <div className="text-left">
                <p className="text-[#F5F1E8] font-medium text-lg">UPI / QR Code</p>
                <p className="text-[#BFAF8A] text-xs mt-0.5">GPay, PhonePe, Paytm, etc.</p>
              </div>
            </div>
            <span className="text-[#C8A45D] group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>

          <motion.button
            className="w-full py-5 px-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-white/30 transition-all"
            onClick={() => onNext('bank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.3)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                🏦
              </div>
              <div className="text-left">
                <p className="text-[#F5F1E8] font-medium text-lg">Bank Transfer</p>
                <p className="text-[#BFAF8A] text-xs mt-0.5">NEFT, IMPS, RTGS</p>
              </div>
            </div>
            <span className="text-[#BFAF8A] group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>

          <motion.button
            className="w-full py-5 px-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-white/30 transition-all"
            onClick={() => onNext('cash')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.4)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                💵
              </div>
              <div className="text-left">
                <p className="text-[#F5F1E8] font-medium text-lg">Cash</p>
                <p className="text-[#BFAF8A] text-xs mt-0.5">Hand over to volunteer</p>
              </div>
            </div>
            <span className="text-[#BFAF8A] group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
