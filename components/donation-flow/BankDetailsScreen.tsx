'use client'

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'

interface BankDetailsScreenProps {
  amount: number
  onNext: () => void
  onBack: () => void
}

export default function BankDetailsScreen({ amount, onNext, onBack }: BankDetailsScreenProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const vadapavCount = Math.floor(amount / 15)

  const bankDetails = {
    name: 'Qamar E Bani Hashim',
    account: '12345678901234',
    ifsc: 'HDFC0001234',
    bank: 'HDFC Bank',
  }

  const handleCopy = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }, [])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

  const buttonBase =
    'w-full py-3.5 rounded-xl text-sm font-medium transition-all border'

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
        {/* Amount */}
        <motion.h2
          className="text-4xl font-semibold text-[#F5F1E8] mb-2"
          style={{ fontFamily: 'var(--font-cinzel)' }}
          {...fadeUp(0.1)}
        >
          ₹{amount.toLocaleString('en-IN')}
        </motion.h2>

        {/* Impact */}
        <motion.p className="text-sm text-[#C8A45D] mb-8" {...fadeUp(0.15)}>
          Your Hadiya can help sponsor {vadapavCount} Vadapavs
        </motion.p>

        {/* Bank Details Card */}
        <motion.div
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-4"
          {...fadeUp(0.2)}
        >
          <div>
            <p className="text-[#BFAF8A] text-xs uppercase tracking-wider mb-1">Account Name</p>
            <div className="flex items-center justify-between">
              <p className="text-[#F5F1E8] font-medium">{bankDetails.name}</p>
            </div>
          </div>
          
          <div>
            <p className="text-[#BFAF8A] text-xs uppercase tracking-wider mb-1">Account Number</p>
            <div className="flex items-center justify-between">
              <p className="text-[#F5F1E8] font-medium font-mono">{bankDetails.account}</p>
              <button 
                onClick={() => handleCopy(bankDetails.account, 'account')}
                className="text-[#C8A45D] text-xs hover:text-[#F5F1E8] transition-colors px-2 py-1 bg-[#C8A45D]/10 rounded"
              >
                {copied === 'account' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[#BFAF8A] text-xs uppercase tracking-wider mb-1">IFSC Code</p>
            <div className="flex items-center justify-between">
              <p className="text-[#F5F1E8] font-medium font-mono">{bankDetails.ifsc}</p>
              <button 
                onClick={() => handleCopy(bankDetails.ifsc, 'ifsc')}
                className="text-[#C8A45D] text-xs hover:text-[#F5F1E8] transition-colors px-2 py-1 bg-[#C8A45D]/10 rounded"
              >
                {copied === 'ifsc' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[#BFAF8A] text-xs uppercase tracking-wider mb-1">Bank Name</p>
            <p className="text-[#F5F1E8] font-medium">{bankDetails.bank}</p>
          </div>
        </motion.div>

        {/* Completed Payment CTA */}
        <motion.button
          className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D] text-base h-14`}
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.3)}
        >
          I&apos;ve Completed Payment →
        </motion.button>
      </div>
    </motion.div>
  )
}
