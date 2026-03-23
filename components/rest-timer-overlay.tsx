'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Timer } from 'lucide-react'

interface CompletedInfo {
  exerciseName: string
  setNum: number
  weight: number
  reps: number
}

interface Props {
  visible: boolean
  duration: number
  onDone: () => void
  completedInfo?: CompletedInfo | null
}

export function RestTimerOverlay({ visible, duration, onDone, completedInfo }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [customDuration, setCustomDuration] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const doneCalledRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // When visible becomes true, start the timer
  useEffect(() => {
    if (visible) {
      doneCalledRef.current = false
      setTimeLeft(customDuration)
      setIsRunning(true)
    } else {
      clearTimer()
      setIsRunning(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Interval tick
  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer()
          setIsRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return clearTimer
  }, [isRunning, clearTimer])

  // When timeLeft hits 0, auto-call onDone after 800ms
  useEffect(() => {
    if (timeLeft === 0 && !doneCalledRef.current && visible) {
      doneCalledRef.current = true
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 400])
      const t = setTimeout(() => {
        onDone()
      }, 800)
      return () => clearTimeout(t)
    }
  }, [timeLeft, visible, onDone])

  useEffect(() => () => clearTimer(), [clearTimer])

  const handleSkip = () => {
    clearTimer()
    setIsRunning(false)
    doneCalledRef.current = true
    onDone()
  }

  const handleChangeDuration = (s: number) => {
    setCustomDuration(s)
    setTimeLeft(s)
    setIsRunning(true)
    doneCalledRef.current = false
  }

  const isComplete = timeLeft === 0

  const SIZE = 160
  const STROKE = 8
  const R = (SIZE - STROKE) / 2
  const CIRC = 2 * Math.PI * R
  const pct = customDuration > 0 ? timeLeft / customDuration : 0

  const display = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center px-6"
          style={{ zIndex: 60, background: 'rgba(10,10,10,0.96)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Completed chip */}
            {completedInfo && (
              <div
                className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
                style={{ background: 'var(--gt-lime-glow)', border: '1px solid rgba(180,255,57,0.3)' }}
              >
                <div className="flex items-center gap-2">
                  <Check size={16} style={{ color: 'var(--gt-lime)' }} />
                  <span className="font-heading font-black text-sm" style={{ color: 'var(--gt-lime)' }}>
                    Serie {completedInfo.setNum} completada
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
                  {completedInfo.exerciseName}
                  {completedInfo.weight > 0 && (
                    <> · {completedInfo.weight}kg × {completedInfo.reps} reps</>
                  )}
                  {completedInfo.weight === 0 && completedInfo.reps > 0 && (
                    <> · {completedInfo.reps} reps</>
                  )}
                </p>
              </div>
            )}

            {/* Timer ring */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Timer size={14} style={{ color: 'var(--gt-text-dim)' }} />
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--gt-text-dim)' }}>
                  Descanso
                </span>
              </div>

              <div className="relative">
                <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
                  <circle
                    cx={SIZE / 2} cy={SIZE / 2} r={R}
                    fill="none"
                    stroke="var(--gt-surface2)"
                    strokeWidth={STROKE}
                  />
                  <motion.circle
                    cx={SIZE / 2} cy={SIZE / 2} r={R}
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
                  {isComplete ? (
                    <span className="font-heading font-black text-4xl" style={{ color: 'var(--gt-lime)' }}>
                      ¡Listo!
                    </span>
                  ) : (
                    <span className="font-heading font-black text-5xl tabular-nums" style={{ color: 'var(--gt-lime)' }}>
                      {display}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="text-sm font-semibold py-2 px-6"
              style={{ color: 'var(--gt-text-dim)' }}
            >
              Saltar descanso
            </button>

            {/* Duration chips — only when not yet done */}
            {!isComplete && (
              <div className="flex gap-2">
                {[60, 90, 120, 180].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleChangeDuration(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                    style={{
                      background: customDuration === s ? 'var(--gt-lime)' : 'var(--gt-surface2)',
                      color: customDuration === s ? 'var(--gt-black)' : 'var(--gt-text-dim)',
                    }}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
