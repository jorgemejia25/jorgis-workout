'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Check, Minus, Plus } from 'lucide-react'
import { ExerciseAnimation } from './exercise-animation'
import type { Exercise, ExerciseHistory } from '@/lib/types'
import type { ExerciseTemplate } from '@/lib/data'

interface Props {
  exercise: Exercise
  template: ExerciseTemplate
  setIdx: number
  prevSession: ExerciseHistory | null
  onSetComplete: (weight: number, reps: number) => void
}

export function ExerciseSlide({ exercise, template, setIdx, prevSession, onSetComplete }: Props) {
  const isBodyweight = template.defaultWeight === 0
  const currentSet = exercise.sets[setIdx]
  const prevSet = prevSession?.sets[setIdx] ?? null

  const initWeight = (): number => {
    if (isBodyweight) return 0
    if (currentSet?.weight > 0) return currentSet.weight
    if (prevSet?.weight && prevSet.weight > 0) return prevSet.weight
    return template.defaultWeight > 0 ? template.defaultWeight : 0
  }

  const initReps = (): number => {
    if ((currentSet?.reps ?? 0) > 0) return currentSet!.reps
    if ((prevSet?.reps ?? 0) > 0) return prevSet!.reps
    return 0
  }

  const [weight, setWeight] = useState<number>(initWeight)
  const [reps, setReps] = useState<number>(initReps)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    setWeight(initWeight())
    setReps(initReps())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIdx, exercise.name])

  const adjustWeight = (delta: number) => {
    setWeight((w) => Math.max(0, Math.round((w + delta) * 10) / 10))
  }

  const adjustReps = (delta: number) => {
    setReps((r) => Math.max(0, r + delta))
  }

  const handleComplete = () => {
    if (!isBodyweight && weight < 0) return
    if (reps <= 0) return
    onSetComplete(weight, reps)
  }

  const completedSets = exercise.sets.filter((s) => s.completed)

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-4 px-4 pt-4 pb-6">

      {/* ── Exercise header ── */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: 'var(--gt-surface)', width: 88, height: 88 }}>
          <ExerciseAnimation animationKey={template.animationKey} size={80} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-black text-[17px] leading-snug">{exercise.name}</h2>
          <div className="flex flex-wrap gap-1 mt-2">
            {template.muscles.map((m) => (
              <span
                key={m}
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'var(--gt-lime-glow)', color: 'var(--gt-lime)', border: '1px solid rgba(180,255,57,0.2)' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Set progress ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{ background: 'var(--gt-surface)' }}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-black text-2xl text-lime">{setIdx + 1}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--gt-text-dim)' }}>/ {exercise.targetSets} series</span>
        </div>
        <div className="flex gap-2">
          {exercise.sets.map((s, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === setIdx ? 20 : 10,
                height: 10,
                background: s.completed
                  ? 'var(--gt-lime)'
                  : i === setIdx
                  ? 'var(--gt-text)'
                  : 'var(--gt-border)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Completed set chips ── */}
      {completedSets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {exercise.sets.map((s, i) =>
            s.completed ? (
              <span
                key={i}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: 'var(--gt-surface)', color: 'var(--gt-lime)', border: '1px solid rgba(180,255,57,0.25)' }}
              >
                <Check size={9} />
                {s.weight > 0 ? `${s.weight}kg × ${s.reps}` : `${s.reps}`}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* ── Weight × Reps steppers ── */}
      <div className="flex items-center gap-3">
        {!isBodyweight && (
          <>
            <div className="flex-1 flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--gt-text-dim)' }}>
                Peso
              </p>
              <div
                className="flex items-stretch rounded-2xl overflow-hidden"
                style={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)', height: 88 }}
              >
                <button
                  className="flex items-center justify-center active:opacity-60 transition-opacity"
                  style={{ width: 52, background: 'var(--gt-surface2)', touchAction: 'manipulation' }}
                  onPointerDown={() => adjustWeight(-2.5)}
                >
                  <Minus size={18} style={{ color: 'var(--gt-text-dim)' }} />
                </button>
                <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
                  <span className="font-heading font-black text-4xl text-lime leading-none tabular-nums">
                    {weight % 1 === 0 ? weight : weight.toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--gt-text-dim)' }}>kg</span>
                </div>
                <button
                  className="flex items-center justify-center active:opacity-60 transition-opacity"
                  style={{ width: 52, background: 'var(--gt-surface2)', touchAction: 'manipulation' }}
                  onPointerDown={() => adjustWeight(2.5)}
                >
                  <Plus size={18} style={{ color: 'var(--gt-lime)' }} />
                </button>
              </div>
            </div>

            <span
              className="font-black text-2xl shrink-0 pb-1"
              style={{ color: 'var(--gt-border)' }}
            >×</span>
          </>
        )}

        <div className="flex-1 flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--gt-text-dim)' }}>
            {isBodyweight ? 'Tiempo' : 'Reps'}
          </p>
          <div
            className="flex items-stretch rounded-2xl overflow-hidden"
            style={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)', height: 88 }}
          >
            <button
              className="flex items-center justify-center active:opacity-60 transition-opacity"
              style={{ width: 52, background: 'var(--gt-surface2)', touchAction: 'manipulation' }}
              onPointerDown={() => adjustReps(-1)}
            >
              <Minus size={18} style={{ color: 'var(--gt-text-dim)' }} />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
              <span className="font-heading font-black text-4xl text-lime leading-none tabular-nums">
                {reps}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--gt-text-dim)' }}>
                {isBodyweight ? 'seg' : 'reps'}
              </span>
            </div>
            <button
              className="flex items-center justify-center active:opacity-60 transition-opacity"
              style={{ width: 52, background: 'var(--gt-surface2)', touchAction: 'manipulation' }}
              onPointerDown={() => adjustReps(1)}
            >
              <Plus size={18} style={{ color: 'var(--gt-lime)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Prev session reference ── */}
      {prevSet && (prevSet.weight > 0 || prevSet.reps > 0) && (
        <p className="text-center text-xs" style={{ color: 'var(--gt-text-dim)' }}>
          Última vez — {prevSet.weight > 0 ? `${prevSet.weight} kg × ` : ''}{prevSet.reps} {isBodyweight ? 'seg' : 'reps'}
        </p>
      )}

      {/* ── Complete button ── */}
      <button
        className="w-full rounded-2xl font-heading font-black text-lg tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        style={{
          background: reps > 0 ? 'var(--gt-lime)' : 'var(--gt-surface)',
          color: reps > 0 ? 'var(--gt-black)' : 'var(--gt-text-dim)',
          border: reps > 0 ? 'none' : '1px solid var(--gt-border)',
          paddingTop: '1.1rem',
          paddingBottom: '1.1rem',
          touchAction: 'manipulation',
        }}
        onClick={handleComplete}
      >
        <Check size={20} />
        Completar serie {setIdx + 1}
      </button>

      {/* ── Instructions accordion ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--gt-border)' }}
      >
        <button
          className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold"
          style={{ background: 'var(--gt-surface)', color: 'var(--gt-text-dim)', touchAction: 'manipulation' }}
          onClick={() => setShowInstructions((v) => !v)}
        >
          <span>Instrucciones de técnica</span>
          {showInstructions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {showInstructions && (
          <div className="px-4 pb-4 pt-3 flex flex-col gap-3" style={{ background: 'var(--gt-surface)' }}>
            <ol className="flex flex-col gap-3">
              {template.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="font-heading font-black shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-0.5"
                    style={{ background: 'var(--gt-lime-glow)', color: 'var(--gt-lime)', border: '1px solid rgba(180,255,57,0.25)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--gt-text)' }}>{step}</span>
                </li>
              ))}
            </ol>

            {template.cues.length > 0 && (
              <div
                className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl mt-1"
                style={{ background: 'rgba(255,181,71,0.07)', border: '1px solid rgba(255,181,71,0.18)' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gt-amber)' }}>
                  Recordá siempre
                </p>
                {template.cues.map((cue, i) => (
                  <p key={i} className="text-sm font-medium" style={{ color: 'var(--gt-amber)' }}>
                    · {cue}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
