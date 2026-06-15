'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Upload } from 'lucide-react'
import { useState, useCallback } from 'react'

interface ConfirmPaymentProps {
  amount: number
  onSubmit: (data: { confirmed: boolean; utr?: string; screenshot?: string }) => void
  onBack: () => void
}

export default function ConfirmPayment({ amount, onSubmit, onBack }: ConfirmPaymentProps) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshotName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setScreenshot(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSubmit = () => {
    onSubmit({
      confirmed: confirmed === true,
      utr: utr || undefined,
      screenshot: screenshot || undefined,
    })
  }

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

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
        transition={{ delay: 0.1 }}
      >
        ← Back
      </motion.button>

      <div className="w-full max-w-sm">
        {/* Title */}
        <motion.h2
          className="text-xl text-[#F5F1E8] mb-2 text-center"
          style={{ fontFamily: 'var(--font-cinzel)' }}
          {...fadeUp(0.1)}
        >
          Confirm Your Payment
        </motion.h2>

        {/* Question */}
        <motion.p
          className="text-[#BFAF8A] text-center mb-8 text-sm"
          {...fadeUp(0.15)}
        >
          Have you completed the payment?
        </motion.p>

        {/* Radio Options */}
        <div className="space-y-3 mb-8">
          <motion.button
            className={`w-full rounded-xl p-4 border text-left transition-all ${
              confirmed === true
                ? 'border-[#C8A45D]/50 bg-[#C8A45D]/5'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
            }`}
            onClick={() => setConfirmed(true)}
            {...fadeUp(0.2)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  confirmed === true ? 'border-[#C8A45D]' : 'border-white/20'
                }`}
              >
                {confirmed === true && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#C8A45D]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                )}
              </div>
              <span className="text-sm text-[#F5F1E8]">
                Yes, I have completed the payment
              </span>
            </div>
          </motion.button>

          <motion.button
            className={`w-full rounded-xl p-4 border text-left transition-all ${
              confirmed === false
                ? 'border-white/20 bg-white/5'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
            }`}
            onClick={() => setConfirmed(false)}
            {...fadeUp(0.25)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  confirmed === false ? 'border-white/40' : 'border-white/20'
                }`}
              >
                {confirmed === false && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-white/60"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                )}
              </div>
              <span className="text-sm text-[#F5F1E8]">
                Not yet, I&apos;ll pay later
              </span>
            </div>
          </motion.button>
        </div>

        {/* Conditional Section */}
        <AnimatePresence>
          {confirmed === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="overflow-hidden mb-8"
            >
              <div className="space-y-6">
                {/* UTR Input */}
                <div>
                  <label className="text-xs text-[#BFAF8A] mb-2 block">
                    Enter UTR / Transaction ID (optional)
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 412345678901"
                    className="w-full py-3 text-[#F5F1E8] bg-transparent border-b border-[#C8A45D]/30 focus:border-[#C8A45D] outline-none transition-colors text-sm placeholder:text-[#BFAF8A]/30"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="text-xs text-[#BFAF8A] mb-2 block">
                    Upload Screenshot (optional)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-[#C8A45D]/20 rounded-xl cursor-pointer hover:border-[#C8A45D]/40 transition-colors bg-white/[0.02]">
                    {screenshot ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={screenshot}
                          alt="Screenshot preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <span className="text-xs text-[#BFAF8A]">{screenshotName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#BFAF8A]/50 mb-2" />
                        <span className="text-xs text-[#BFAF8A]/50">
                          Tap to upload screenshot
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        {confirmed !== null && (
          <motion.button
            className="w-full h-14 bg-gradient-to-r from-[#C8A45D]/20 to-[#C8A45D]/10 border border-[#C8A45D]/30 text-[#C8A45D] rounded-xl text-lg transition-all hover:from-[#C8A45D]/30 hover:to-[#C8A45D]/20"
            onClick={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit →
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
