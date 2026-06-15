'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

interface HeroScreenProps {
  amount: number
  setAmount: (n: number) => void
  onNext: () => void
  stats: { totalRaised: number; donorCount: number } | null
}

const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
})

function AnimatedVadapavCount({ count }: { count: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 15 })
  const display = useTransform(spring, (v) => Math.floor(v))

  useEffect(() => {
    spring.set(count)
  }, [count, spring])

  return <motion.span>{display}</motion.span>
}

export default function HeroScreen({ amount, setAmount, onNext, stats }: HeroScreenProps) {
  const totalRaised = stats?.totalRaised ?? 0
  const goal = 30000
  const percentage = Math.min(Math.round((totalRaised / goal) * 100), 100)
  const vadapavCount = Math.floor(amount / 15)

  // Calculate slider fill percentage for dynamic background
  const sliderFillPercent = useMemo(() => {
    return ((Math.min(Math.max(amount, 500), 10000) - 500) / 9500) * 100
  }, [amount])

  const handleAmountChange = (value: string) => {
    // Remove formatting characters
    const cleanValue = value.replace(/\D/g, '')
    const num = parseInt(cleanValue, 10)
    if (!isNaN(num) && num >= 0) {
      setAmount(num)
    } else if (value === '' || cleanValue === '') {
      setAmount(0)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-10 relative w-full max-w-md mx-auto">
      
      {/* Progress Bar (Top Anchored) */}
      <motion.div className="w-full mb-12" {...fadeUp(0)}>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#BFAF8A]/80 tracking-wider">₹{totalRaised.toLocaleString('en-IN')} Raised of ₹30,000</span>
          <span className="text-[11px] text-[#C8A45D] font-medium">{percentage}%</span>
        </div>
        <div className="w-full h-[2px] rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#C8A45D' }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Compressed Header Area */}
      <motion.div className="text-center mb-12" {...fadeUp(0.15)}>
        <h1
          className="text-3xl sm:text-4xl text-[#F5F1E8] mb-2 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Sabeel-e-Imam Hussain (A.S.)
        </h1>
        <p className="text-[13px] text-[#BFAF8A] italic">
          Serving in the name of Hussain (A.S.)
        </p>
      </motion.div>

      {/* Anchor: Amount and Slider Block */}
      <motion.div className="w-full flex flex-col items-center mb-12" {...fadeUp(0.3)}>
        
        {/* Seamless Amount Element */}
        <div className="relative mb-2 flex items-center justify-center group">
          <input
            type="text"
            inputMode="numeric"
            value={amount ? `₹${amount.toLocaleString('en-IN')}` : '₹'}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="text-[3.5rem] leading-none font-semibold text-[#F5F1E8] bg-transparent border-b border-transparent focus:border-[#C8A45D]/50 outline-none text-center w-64 transition-all pb-1"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
        </div>

        {/* Impact Statement */}
        <div className="text-center mb-8">
          <p className="text-[13px] text-[#BFAF8A]/80 mb-1">Your Hadiya can help sponsor</p>
          <p className="text-[#C8A45D] text-lg" style={{ textShadow: '0 0 10px rgba(109,15,23,0.6)' }}>
            <AnimatedVadapavCount count={vadapavCount} /> Vadapavs
          </p>
        </div>

        {/* Slider directly below impact */}
        <div className="w-full max-w-[280px]">
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={Math.min(Math.max(amount, 500), 10000)}
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
            className="slider-gold w-full"
            style={{
              background: `linear-gradient(to right, rgba(200, 164, 93, 0.4) 0%, rgba(200, 164, 93, 0.4) ${sliderFillPercent}%, rgba(255, 255, 255, 0.05) ${sliderFillPercent}%, rgba(255, 255, 255, 0.05) 100%)`,
            }}
          />
        </div>
      </motion.div>

      {/* Elegant Stats Row (No Boxes) */}
      <motion.div 
        className="flex items-center justify-center space-x-3 text-[11px] text-[#BFAF8A]/70 mb-10 tracking-wide"
        {...fadeUp(0.45)}
      >
        <span>2100+ Served</span>
        <span className="text-[#C8A45D] opacity-50">•</span>
        <span>₹30k Goal</span>
        <span className="text-[#C8A45D] opacity-50">•</span>
        <span>25+ Volunteers</span>
      </motion.div>

      {/* Primary CTA */}
      <motion.button
        className="w-[72px] h-[72px] rounded-full bg-transparent border border-[#C8A45D]/30 flex items-center justify-center transition-all hover:border-[#C8A45D]/60"
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ 
          boxShadow: '0 0 20px rgba(109,15,23,0.4)',
          animationName: 'pulse-glow', 
          animationDuration: '4s', 
          animationIterationCount: 'infinite' 
        }}
        {...fadeUp(0.6)}
      >
        <ArrowRight className="w-6 h-6 text-[#C8A45D]" strokeWidth={1.5} />
      </motion.button>
      
    </div>
  )
}
