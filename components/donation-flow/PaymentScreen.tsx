'use client'

import { motion } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { useState, useCallback } from 'react'

interface PaymentScreenProps {
  amount: number
  name: string
  phone: string
  onNext: () => void
  onBack: () => void
}

const UPI_ID = 'meesamhyder2005-1@oksbi'

export default function PaymentScreen({ amount, name, phone, onNext, onBack }: PaymentScreenProps) {
  const [copied, setCopied] = useState(false)
  const vadapavCount = Math.floor(amount / 15)

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent('Qamar E Bani Hashim')}&am=${amount}&cu=INR&tn=${encodeURIComponent('Hadiya Sabeel')}`
  const gpayUrl = `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent('Qamar E Bani Hashim')}&am=${amount}&cu=INR&tn=${encodeURIComponent('Hadiya Sabeel')}`
  const phonepeUrl = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent('Qamar E Bani Hashim')}&am=${amount}&cu=INR&tn=${encodeURIComponent('Hadiya Sabeel')}`

  const handleCopyUPI = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = UPI_ID
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

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

        {/* Payment Buttons */}
        <div className="w-full space-y-3 mb-6">
          <motion.button
            className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D]`}
            onClick={() => { window.location.href = upiUrl }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.35)}
          >
            Open Any UPI App
          </motion.button>

          <motion.button
            className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/15 to-[#C8A45D]/5 border-[#C8A45D]/20 text-[#C8A45D]/90`}
            onClick={() => { window.location.href = gpayUrl }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.4)}
          >
            Open Google Pay
          </motion.button>

          <motion.button
            className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/15 to-[#C8A45D]/5 border-[#C8A45D]/20 text-[#C8A45D]/90`}
            onClick={() => { window.location.href = phonepeUrl }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.45)}
          >
            Open PhonePe
          </motion.button>

          <motion.button
            className={`${buttonBase} bg-white/5 border-white/10 text-[#BFAF8A]`}
            onClick={handleCopyUPI}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...fadeUp(0.5)}
          >
            {copied ? '✓ Copied!' : 'Copy UPI ID'}
          </motion.button>
        </div>

        {/* Completed Payment CTA */}
        <motion.button
          className={`${buttonBase} bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D] text-base h-14`}
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.55)}
        >
          I&apos;ve Completed Payment →
        </motion.button>
      </div>
    </motion.div>
  )
}
