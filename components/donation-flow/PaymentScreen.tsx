'use client'

import { motion } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { useState, useCallback } from 'react'
import { generateUPIUrl, getUPIId } from '@/lib/upi'

interface PaymentScreenProps {
  amount: number
  name: string
  phone: string
  onNext: () => void
  onBack: () => void
}

export default function PaymentScreen({ amount, name, phone, onNext, onBack }: PaymentScreenProps) {
  const [copied, setCopied] = useState(false)
  const vadapavCount = Math.floor(amount / 15)

  const upiUrl = generateUPIUrl(amount)
  const upiId = getUPIId()

  const handleCopyUPI = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = upiId
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [upiId])

  const handleDownloadQR = useCallback(() => {
    const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qamar-donation-qr-${amount}.png`
    a.click()
  }, [amount])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

  const buttonBase =
    'w-full py-3.5 rounded-xl text-sm font-medium transition-all border'

  return (
    <motion.div
      className="min-h-dvh flex flex-col items-center px-6 py-12 relative"
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

      <div className="w-full max-w-sm flex flex-col items-center mt-12">
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

        {/* QR Code */}
        <motion.div
          id="qr-canvas"
          className="bg-white p-3 rounded-2xl mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
        >
          <QRCodeCanvas
            value={upiUrl}
            size={200}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </motion.div>

        {/* Download QR */}
        <motion.button
          className="text-[#BFAF8A] text-xs underline mb-8 hover:text-[#C8A45D] transition-colors"
          onClick={handleDownloadQR}
          {...fadeUp(0.3)}
        >
          Download QR
        </motion.button>

        {/* Payment Buttons — all use the same upi://pay URL which opens the system app chooser */}
        <div className="w-full space-y-3 mb-6">
          <motion.a
            href={upiUrl}
            className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D] block text-center`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.35)}
          >
            Pay via UPI App
          </motion.a>

          <motion.button
            className={`${buttonBase} bg-white/5 border-white/10 text-[#BFAF8A]`}
            onClick={handleCopyUPI}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.4)}
          >
            {copied ? '✓ Copied!' : `Copy UPI ID: ${upiId}`}
          </motion.button>
        </div>

        {/* Completed Payment CTA */}
        <motion.button
          className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D] text-base h-14`}
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.45)}
        >
          I&apos;ve Completed Payment →
        </motion.button>
      </div>
    </motion.div>
  )
}
