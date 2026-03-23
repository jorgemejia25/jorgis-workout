'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { REST_TIMER_OPTIONS } from '@/lib/data'

export function RestTimer() {
  const [duration, setDuration] = useState(90)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const start = useCallback(() => {
    clear()
    setTimeLeft(duration)
    setIsRunning(true)
  }, [duration, clear])

  const reset = useCallback(() => {
    clear()
    setTimeLeft(null)
    setIsRunning(false)
  }, [clear])

  useEffect(() => {
    if (!isRunning || timeLeft === null) return
    if (timeLeft <= 0) {
      clear()
      setIsRunning(false)
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 400])
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => (t !== null ? t - 1 : null))
    }, 1000)
    return clear
  }, [isRunning, timeLeft, clear])

  useEffect(() => () => clear(), [clear])

  const pct = timeLeft !== null ? timeLeft / duration : 1
  const SIZE = 80
  const STROKE = 6
  const R = (SIZE - STROKE) / 2
  const CIRC = 2 * Math.PI * R
  const isComplete = timeLeft === 0
  const isActive = timeLeft !== null

  const display = timeLeft !== null
    ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
    : `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`

  return (
    <div
      className="card-dark flex flex-col gap-3"
    >
      <h3
        className="font-heading font-bold text-xs uppercase tracking-wider"
        style={{ color: 'var(--gt-text-dim)' }}
      >
        Timer de descanso
      </h3>

      {/* Duration selector */}
      <div className="flex gap-2">
        {REST_TIMER_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setDuration(s); reset() }}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={{
              background: duration === s ? 'var(--gt-lime)' : 'var(--gt-surface2)',
              color: duration === s ? 'var(--gt-black)' : 'var(--gt-text-dim)',
            }}
          >
            {s}s
          </button>
        ))}
      </div>

      {/* Circle + controls */}
      <div className="flex items-center gap-4">
        {/* SVG ring */}
        <div className="relative shrink-0">
          <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
            <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="var(--gt-surface2)" strokeWidth={STROKE} />
            <motion.circle
              cx={SIZE/2} cy={SIZE/2} r={R}
              fill="none"
              stroke={isComplete ? 'var(--gt-amber)' : 'var(--gt-lime)'}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - pct * CIRC}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-heading font-black text-sm"
              style={{ color: isComplete ? 'var(--gt-amber)' : 'var(--gt-lime)' }}
            >
              {isComplete ? '✓' : display}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 flex-1">
          <button
            onClick={isRunning ? reset : start}
            className="w-full py-2.5 rounded-xl font-heading font-bold text-sm"
            style={{
              background: isRunning ? 'var(--gt-surface2)' : 'var(--gt-lime)',
              color: isRunning ? 'var(--gt-text-dim)' : 'var(--gt-black)',
            }}
          >
            {isRunning ? 'Cancelar' : isActive ? 'Reiniciar' : 'Iniciar'}
          </button>
          {isActive && !isRunning && (
            <button
              onClick={start}
              className="w-full py-2 rounded-xl text-xs font-bold"
              style={{ background: 'var(--gt-surface2)', color: 'var(--gt-text-dim)' }}
            >
              Nuevo descanso
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
