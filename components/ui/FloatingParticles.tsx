'use client'

import { useMemo } from 'react'

interface Particle {
  id: number
  left: string
  size: number
  opacity: number
  duration: number
  delay: number
  drift: number
}

export default function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 20,
      drift: -20 + Math.random() * 40,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#C8A45D',
            animationName: 'particle-float',
            animationDuration: `${p.duration}s`,
            animationTimingFunction: 'linear',
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            '--particle-opacity': p.opacity,
            '--particle-drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
