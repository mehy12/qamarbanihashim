'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface DonorDetailsProps {
  name: string
  setName: (s: string) => void
  phone: string
  setPhone: (s: string) => void
  amount: number
  onNext: () => void
  onBack: () => void
}

export default function DonorDetails({
  name,
  setName,
  phone,
  setPhone,
  amount,
  onNext,
  onBack,
}: DonorDetailsProps) {
  const [touched, setTouched] = useState({ name: false, phone: false })

  const nameValid = name.trim().length >= 2
  const phoneValid = /^[6-9]\d{9}$/.test(phone)
  const canContinue = nameValid && phoneValid

  const vadapavCount = Math.floor(amount / 15)

  return (
    <motion.div
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 relative"
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
        transition={{ delay: 0.2 }}
      >
        ← Back
      </motion.button>

      <div className="w-full max-w-sm">
        {/* Amount Summary */}
        <motion.p
          className="text-sm text-[#BFAF8A] text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ₹{amount.toLocaleString('en-IN')} · Your Hadiya can help sponsor {vadapavCount} Vadapavs
        </motion.p>

        {/* Name Input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Your Name"
            className="w-full py-4 text-xl text-[#F5F1E8] bg-transparent border-b border-[#C8A45D]/30 focus:border-[#C8A45D] outline-none transition-colors placeholder:text-[#BFAF8A]/40"
          />
          {touched.name && !nameValid && (
            <motion.p
              className="text-red-400/80 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Please enter at least 2 characters
            </motion.p>
          )}
        </motion.div>

        {/* Phone Input */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center border-b border-[#C8A45D]/30 focus-within:border-[#C8A45D] transition-colors">
            <span className="text-[#BFAF8A] text-xl mr-2 py-4">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val.length <= 10) setPhone(val)
              }}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              maxLength={10}
              placeholder="Phone Number"
              className="w-full py-4 text-xl text-[#F5F1E8] bg-transparent outline-none placeholder:text-[#BFAF8A]/40"
            />
          </div>
          {touched.phone && !phoneValid && (
            <motion.p
              className="text-red-400/80 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Please enter a valid 10-digit Indian mobile number
            </motion.p>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.button
          className={`w-full h-14 bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border border-[#C8A45D]/30 text-[#C8A45D] rounded-xl text-lg transition-all ${
            !canContinue ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#C8A45D]/30 hover:to-[#C8A45D]/20'
          }`}
          onClick={canContinue ? onNext : undefined}
          disabled={!canContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={canContinue ? { scale: 1.02 } : undefined}
          whileTap={canContinue ? { scale: 0.98 } : undefined}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  )
}
