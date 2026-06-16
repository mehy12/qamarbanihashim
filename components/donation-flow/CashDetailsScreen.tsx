'use client'

import { motion } from 'framer-motion'

interface CashDetailsScreenProps {
  amount: number
  onNext: () => void
  onBack: () => void
}

export default function CashDetailsScreen({ amount, onNext, onBack }: CashDetailsScreenProps) {
  const vadapavCount = Math.floor(amount / 15)

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

        {/* Cash Instructions Card */}
        <motion.div
          className="w-full bg-white/5 border border-[#C8A45D]/30 rounded-2xl p-6 mb-8 text-center"
          {...fadeUp(0.2)}
        >
          <div className="w-16 h-16 rounded-full bg-[#C8A45D]/20 flex items-center justify-center text-3xl mx-auto mb-4">
            🤲
          </div>
          <h3 className="text-[#F5F1E8] font-medium text-lg mb-2">Cash Collection</h3>
          <p className="text-[#BFAF8A] text-sm leading-relaxed">
            Please hand over the cash amount to our volunteer or drop it in the collection box. 
            Once done, tap the button below to record your donation.
          </p>
        </motion.div>

        {/* Completed Payment CTA */}
        <motion.button
          className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D] text-base h-14`}
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.3)}
        >
          I&apos;ve Handed Over Cash →
        </motion.button>
      </div>
    </motion.div>
  )
}
