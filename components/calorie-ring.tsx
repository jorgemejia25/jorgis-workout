'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface CalorieRingProps {
  consumed: number
  goal: number
}

export function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const [animated, setAnimated] = useState(0)
  const pct = Math.min(consumed / goal, 1)
  const SIZE = 220
  const STROKE = 14
  const R = (SIZE - STROKE) / 2
  const CIRC = 2 * Math.PI * R
  const over = consumed > goal

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 100)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke="var(--gt-surface2)"
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <motion.circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={over ? 'var(--gt-amber)' : 'var(--gt-lime)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: CIRC - animated * CIRC }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${over ? 'var(--gt-amber)' : 'var(--gt-lime)'})` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-heading font-black text-4xl leading-none"
            style={{ color: over ? 'var(--gt-amber)' : 'var(--gt-lime)' }}
            key={consumed}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {consumed}
          </motion.span>
          <span className="text-sm mt-1" style={{ color: 'var(--gt-text-dim)' }}>
            kcal
          </span>
          <span className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>
            de {goal}
          </span>
        </div>
      </div>

      {/* Remaining */}
      <p className="mt-2 text-sm" style={{ color: over ? 'var(--gt-amber)' : 'var(--gt-text-dim)' }}>
        {over
          ? `+${consumed - goal} kcal sobre la meta`
          : `Faltan ${goal - consumed} kcal`
        }
      </p>
    </div>
  )
}
