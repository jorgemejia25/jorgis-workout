'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Dumbbell, Activity, Play, FlagTriangleRight, Trophy,
  Moon, Check, ChevronLeft, ChevronRight, Utensils,
} from 'lucide-react'
import { useWorkout } from '@/lib/hooks/use-workouts'
import { useStreak } from '@/lib/hooks/use-streak'
import { useSettings } from '@/lib/hooks/use-settings'
import { UPPER_EXERCISES, LOWER_EXERCISES } from '@/lib/data'
import { ExerciseSlide } from '@/components/exercise-slide'
import { RestTimerOverlay } from '@/components/rest-timer-overlay'

const WORKOUT_LABELS = {
  upper: 'Tren Superior',
  lower: 'Tren Inferior',
}

const WORKOUT_ICONS = {
  upper: <Dumbbell size={18} />,
  lower: <Activity size={18} />,
}

function formatDuration(ms: number) {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

const allTemplates = [...UPPER_EXERCISES, ...LOWER_EXERCISES]

export default function WorkoutPage() {
  const {
    workout, todayType, isStarted, isFinished,
    startWorkout, startWorkoutWithType, updateSet, finishWorkout, getPreviousSession,
  } = useWorkout()
  const { incrementStreak } = useStreak()
  const { settings } = useSettings()
  const [showSummary, setShowSummary] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // In-progress navigation state
  const [exIdx, setExIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [restVisible, setRestVisible] = useState(false)
  const [restCompletedInfo, setRestCompletedInfo] = useState<{
    exerciseName: string
    setNum: number
    weight: number
    reps: number
  } | null>(null)

  useEffect(() => {
    if (!isStarted || !workout) return
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - workout.startedAt)
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isStarted, workout])

  const handleFinish = () => {
    finishWorkout()
    incrementStreak()
    setShowSummary(true)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleSetComplete = (weight: number, reps: number) => {
    if (!workout) return
    updateSet(exIdx, setIdx, { weight, reps, completed: true })
    setRestCompletedInfo({
      exerciseName: workout.exercises[exIdx].name,
      setNum: setIdx + 1,
      weight,
      reps,
    })
    setRestVisible(true)
  }

  const handleRestDone = () => {
    setRestVisible(false)
    if (!workout) return
    const sets = workout.exercises[exIdx].sets
    if (setIdx + 1 < sets.length) {
      setSetIdx((s) => s + 1)
    } else if (exIdx + 1 < workout.exercises.length) {
      setDirection(1)
      setExIdx((i) => i + 1)
      setSetIdx(0)
    } else {
      handleFinish()
    }
  }

  const goToExercise = (newIdx: number) => {
    if (!workout) return
    setDirection(newIdx > exIdx ? 1 : -1)
    setExIdx(newIdx)
    const firstIncomplete = workout.exercises[newIdx].sets.findIndex((s) => !s.completed)
    setSetIdx(firstIncomplete >= 0 ? firstIncomplete : workout.exercises[newIdx].sets.length - 1)
  }

  const totalVolume = workout?.exercises.reduce((acc, ex) =>
    acc + ex.sets.reduce((s, set) => s + (set.completed ? set.weight * set.reps : 0), 0), 0) ?? 0
  const totalSets = workout?.exercises.reduce((acc, ex) =>
    acc + ex.sets.filter((s) => s.completed).length, 0) ?? 0
  const duration = workout?.finishedAt && workout.startedAt
    ? workout.finishedAt - workout.startedAt
    : elapsed

  // ─── REST DAY ────────────────────────────────────────────
  if (!todayType && !workout) {
    return (
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-black text-3xl text-lime">Entreno</h1>
        </motion.div>

        <motion.div
          className="card-dark flex flex-col items-center gap-3 py-8"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--gt-surface2)' }}
          >
            <Moon size={32} style={{ color: 'var(--gt-text-dim)' }} />
          </div>
          <div className="text-center">
            <h2 className="font-heading font-black text-xl">Día de descanso</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--gt-text-dim)' }}>
              Hoy toca recuperar. Los músculos crecen mientras descansás.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="card-dark flex flex-col gap-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
            ¿Querés entrenar igual?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all"
              style={{ borderColor: 'var(--gt-border)', background: 'var(--gt-surface2)' }}
              onClick={() => startWorkoutWithType('upper')}
            >
              <Dumbbell size={24} className="text-lime" />
              <span className="font-heading font-bold text-sm">Tren Superior</span>
              <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>6 ejercicios</span>
            </button>
            <button
              className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all"
              style={{ borderColor: 'var(--gt-border)', background: 'var(--gt-surface2)' }}
              onClick={() => startWorkoutWithType('lower')}
            >
              <Activity size={24} className="text-lime" />
              <span className="font-heading font-bold text-sm">Tren Inferior</span>
              <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>5 ejercicios</span>
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── NOT STARTED (scheduled day) ─────────────────────────
  if (!workout) {
    const type = todayType!
    const previewNames = type === 'upper'
      ? ['Press de barra', 'Remo con barra', 'Press militar', 'Curl bíceps', 'Tríceps', 'Elevaciones']
      : ['Sentadilla', 'Peso muerto rumano', 'Zancadas', 'Pantorrillas', 'Plancha']

    return (
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--gt-lime)' }}
          >
            {type === 'upper'
              ? <Dumbbell size={22} color="var(--gt-black)" />
              : <Activity size={22} color="var(--gt-black)" />}
          </div>
          <div>
            <h1 className="font-heading font-black text-3xl text-lime">{WORKOUT_LABELS[type]}</h1>
            <p className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>
              {type === 'upper' ? '6 ejercicios · Upper body' : '5 ejercicios · Lower body'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {previewNames.map((ex, i) => (
            <div key={i} className="card-dark flex items-center gap-3 py-2.5">
              <span className="font-heading font-black text-lime text-sm w-6 text-center shrink-0">{i + 1}</span>
              <span className="text-sm">{ex}</span>
            </div>
          ))}
        </div>

        <button
          className="w-full py-4 rounded-2xl font-heading font-black text-base tracking-wide flex items-center justify-center gap-2 mt-1"
          style={{ background: 'var(--gt-lime)', color: 'var(--gt-black)' }}
          onClick={startWorkout}
        >
          <Play size={18} fill="var(--gt-black)" />
          Iniciar entreno
        </button>
      </div>
    )
  }

  // ─── FINISHED ────────────────────────────────────────────
  if (isFinished && !showSummary) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'var(--gt-lime)' }}
        >
          <Trophy size={48} color="var(--gt-black)" />
        </motion.div>
        <div className="text-center">
          <h1 className="font-heading font-black text-3xl text-lime">Entreno completado</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--gt-text-dim)' }}>Excelente trabajo hoy.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="card-dark text-center py-4">
            <p className="font-heading font-black text-2xl text-lime">{totalSets}</p>
            <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>series completadas</p>
          </div>
          <div className="card-dark text-center py-4">
            <p className="font-heading font-black text-2xl text-lime">{totalVolume}</p>
            <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>kg de volumen</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── IN PROGRESS ─────────────────────────────────────────
  const currentType = workout.type
  const completedSetsCount = workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0)
  const allSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const currentTemplate = allTemplates.find((t) => t.name === workout.exercises[exIdx]?.name)!
  const prevSession = getPreviousSession(workout.exercises[exIdx]?.name ?? '')

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 51, background: 'var(--gt-black)' }}
    >
      {/* Fixed topbar */}
      <div
        className="flex flex-col shrink-0"
        style={{
          background: 'rgba(17,17,17,0.92)',
          borderBottom: '1px solid var(--gt-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          className="flex items-center justify-between gap-3 px-4"
          style={{
            paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
            paddingBottom: '0.75rem',
          }}
        >
          {/* Left: type icon + name */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gt-lime-glow)' }}
            >
              {WORKOUT_ICONS[currentType]}
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-lime leading-none">{WORKOUT_LABELS[currentType]}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>{completedSetsCount}/{allSets} series</p>
            </div>
          </div>

          {/* Center: elapsed timer */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: 'var(--gt-red)',
                boxShadow: '0 0 6px var(--gt-red)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <span
              className="font-heading font-black text-2xl tabular-nums"
              style={{ color: 'var(--gt-lime)', letterSpacing: '0.04em' }}
            >
              {formatDuration(elapsed)}
            </span>
          </div>

          {/* Right: finish */}
          <button
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-heading font-bold text-sm"
            style={{ background: 'var(--gt-lime)', color: 'var(--gt-black)' }}
            onClick={handleFinish}
          >
            <FlagTriangleRight size={14} />
            Finalizar
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: 'var(--gt-surface2)' }}>
          <div
            style={{
              height: 2,
              background: 'var(--gt-lime)',
              width: `${(exIdx / workout.exercises.length) * 100}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Slide container */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={exIdx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 overflow-y-auto scrollbar-none"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            {currentTemplate && (
              <ExerciseSlide
                exercise={workout.exercises[exIdx]}
                template={currentTemplate}
                setIdx={setIdx}
                prevSession={prevSession}
                onSetComplete={handleSetComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev arrow */}
        {exIdx > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid var(--gt-border)', zIndex: 20 }}
            onClick={() => goToExercise(exIdx - 1)}
          >
            <ChevronLeft size={20} style={{ color: 'var(--gt-text-dim)' }} />
          </button>
        )}

        {/* Next arrow */}
        {exIdx < workout.exercises.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid var(--gt-border)', zIndex: 20 }}
            onClick={() => goToExercise(exIdx + 1)}
          >
            <ChevronRight size={20} style={{ color: 'var(--gt-text-dim)' }} />
          </button>
        )}
      </div>

      {/* Rest timer overlay */}
      <RestTimerOverlay
        visible={restVisible}
        duration={settings.restDuration ?? 90}
        onDone={handleRestDone}
        completedInfo={restCompletedInfo}
      />

      {/* Summary modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)' }} />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)' }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="text-center flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gt-lime)' }}>
                  <Trophy size={36} color="var(--gt-black)" />
                </div>
                <h2 className="font-heading font-black text-2xl text-lime">Entreno completo</h2>
                <p className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>Gran trabajo, seguí así.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'duración',       value: formatDuration(duration) },
                  { label: 'series hechas',  value: String(totalSets) },
                  { label: 'kg de volumen',  value: String(totalVolume) },
                  { label: 'ejercicios',     value: String(workout.exercises.length) },
                ].map(({ label, value }) => (
                  <div key={label} className="card-dark text-center py-3">
                    <p className="font-heading font-black text-xl text-lime">{value}</p>
                    <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>{label}</p>
                  </div>
                ))}
              </div>

              <button
                className="w-full py-3.5 rounded-xl font-heading font-black text-base flex items-center justify-center gap-2"
                style={{ background: 'var(--gt-lime)', color: 'var(--gt-black)' }}
                onClick={() => setShowSummary(false)}
              >
                <Utensils size={16} />
                A comer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
