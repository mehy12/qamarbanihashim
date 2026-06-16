"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const FloatingParticles = dynamic(
  () => import("@/components/ui/FloatingParticles"),
  { ssr: false }
);
const HeroScreen = dynamic(
  () => import("@/components/donation-flow/HeroScreen"),
  { ssr: false }
);
const DonorDetails = dynamic(
  () => import("@/components/donation-flow/DonorDetails"),
  { ssr: false }
);
const PaymentMethodScreen = dynamic(
  () => import("@/components/donation-flow/PaymentMethodScreen"),
  { ssr: false }
);
const BankDetailsScreen = dynamic(
  () => import("@/components/donation-flow/BankDetailsScreen"),
  { ssr: false }
);
const CashDetailsScreen = dynamic(
  () => import("@/components/donation-flow/CashDetailsScreen"),
  { ssr: false }
);
const PaymentScreen = dynamic(
  () => import("@/components/donation-flow/PaymentScreen"),
  { ssr: false }
);
const ConfirmPayment = dynamic(
  () => import("@/components/donation-flow/ConfirmPayment"),
  { ssr: false }
);
const ThankYou = dynamic(
  () => import("@/components/donation-flow/ThankYou"),
  { ssr: false }
);

// Animation variants for page transitions
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

interface Stats {
  totalRaised: number;
  donorCount: number;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Donation state
  const [amount, setAmount] = useState(1500);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'cash' | null>(null);

  // Live stats
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch live stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchStats();
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 6));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleConfirmPayment = useCallback(
    async (data: {
      confirmed: boolean;
      utr?: string;
      screenshot?: string;
    }) => {
      try {
        await fetch("/api/donations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            amount,
            utr: data.utr || null,
            screenshotBase64: data.screenshot || null,
            status: data.confirmed ? "pending" : "incomplete",
          }),
        });
      } catch (err) {
        console.error("Failed to submit donation:", err);
      }
      goNext();
    },
    [name, phone, amount, goNext]
  );

  return (
    <>
      <FloatingParticles />

      <div className="relative min-h-dvh flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="hero"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              <HeroScreen
                amount={amount}
                setAmount={setAmount}
                onNext={goNext}
                stats={stats}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="details"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              <DonorDetails
                name={name}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                amount={amount}
                onNext={goNext}
                onBack={goBack}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="payment-method"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              <PaymentMethodScreen
                amount={amount}
                onNext={(method) => {
                  setPaymentMethod(method);
                  goNext();
                }}
                onBack={goBack}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="payment"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              {paymentMethod === 'upi' ? (
                <PaymentScreen
                  amount={amount}
                  name={name}
                  phone={phone}
                  onNext={goNext}
                  onBack={goBack}
                />
              ) : paymentMethod === 'bank' ? (
                <BankDetailsScreen
                  amount={amount}
                  onNext={goNext}
                  onBack={goBack}
                />
              ) : (
                <CashDetailsScreen
                  amount={amount}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="confirm"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              <ConfirmPayment
                amount={amount}
                paymentMethod={paymentMethod}
                onSubmit={handleConfirmPayment}
                onBack={goBack}
              />
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="thanks"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="w-full min-h-dvh flex items-center justify-center"
            >
              <ThankYou amount={amount} name={name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
