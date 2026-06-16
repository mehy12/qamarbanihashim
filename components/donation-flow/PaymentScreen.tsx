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
  const [saved, setSaved] = useState(false)
  const vadapavCount = Math.floor(amount / 15)

  const upiUrl = generateUPIUrl(amount)
  const upiId = getUPIId()

  const handleCopyUPI = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
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

  const handleSaveQR = useCallback(() => {
    const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement
    if (!canvas) return
    
    // Add significant padding (quiet zone) for GPay scanner compatibility
    const padding = 40
    const newCanvas = document.createElement('canvas')
    newCanvas.width = canvas.width + padding * 2
    newCanvas.height = canvas.height + padding * 2
    
    const ctx = newCanvas.getContext('2d')
    if (!ctx) return
    
    // Fill white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)
    
    // Draw original QR code centered
    ctx.drawImage(canvas, padding, padding)
    
    const url = newCanvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qamar-donation-qr-${amount}.png`
    a.click()
    setSaved(true)
  }, [amount])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

  const buttonBase =
    'w-full py-3.5 rounded-xl text-sm font-medium transition-all border'

  const steps = [
    { num: '1', text: 'Save the QR Code below', icon: '📥' },
    { num: '2', text: 'Open any UPI app', icon: '📱' },
    { num: '3', text: 'Upload the saved QR from gallery', icon: '🖼️' },
  ]

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
        <motion.p className="text-sm text-[#C8A45D] mb-6" {...fadeUp(0.15)}>
          Your Hadiya can help sponsor {vadapavCount} Vadapavs
        </motion.p>

        {/* QR Code */}
        <motion.div
          id="qr-canvas"
          className="bg-white p-4 rounded-2xl mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
        >
          <QRCodeCanvas
            value={upiUrl}
            size={220}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            marginSize={2}
          />
        </motion.div>

        {/* Save QR Button */}
        <motion.button
          className={`${buttonBase} ${
            saved
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border-[#C8A45D]/30 text-[#C8A45D]'
          } mb-6`}
          onClick={handleSaveQR}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.3)}
        >
          {saved ? '✓ QR Saved to Gallery' : '📥 Save QR Code'}
        </motion.button>

        {/* Steps Card */}
        <motion.div
          className="w-full rounded-2xl border border-[#C8A45D]/15 bg-[#C8A45D]/5 p-5 mb-6"
          {...fadeUp(0.35)}
        >
          <p className="text-xs font-medium text-[#C8A45D]/70 uppercase tracking-wider mb-4">
            How to pay
          </p>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{step.icon}</span>
                <span className="text-sm text-[#F5F1E8]/80">{step.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Copy UPI ID fallback */}
        <motion.button
          className={`${buttonBase} bg-white/5 border-white/10 text-[#BFAF8A] mb-4`}
          onClick={handleCopyUPI}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...fadeUp(0.4)}
        >
          {copied ? '✓ Copied!' : `Copy UPI ID · ${upiId}`}
        </motion.button>

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
