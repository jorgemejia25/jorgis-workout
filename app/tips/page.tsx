'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Utensils, Moon, Clock, Scale, TrendingUp,
  AlertTriangle, ChevronRight,
} from 'lucide-react'
import { useSettings } from '@/lib/hooks/use-settings'
import { TIPS, PROGRESSION_TIPS, DAY_NAMES_SHORT, UPPER_EXERCISES, LOWER_EXERCISES } from '@/lib/data'
import type { WorkoutSchedule } from '@/lib/types'

const LUCIDE_ICONS: Record<string, React.ReactNode> = {
  Utensils: <Utensils size={18} color="var(--gt-lime)" />,
  Moon:     <Moon size={18} color="var(--gt-lime)" />,
  Clock:    <Clock size={18} color="var(--gt-lime)" />,
  Scale:    <Scale size={18} color="var(--gt-lime)" />,
  TrendingUp: <TrendingUp size={18} color="var(--gt-lime)" />,
}

interface FieldConfig {
  key: keyof import('@/lib/types').UserSettings
  label: string
  unit: string
  step: number
}

const FIELDS: FieldConfig[] = [
  { key: 'weight',      label: 'Peso actual',       unit: 'kg',   step: 0.1 },
  { key: 'height',      label: 'Altura',             unit: 'm',    step: 0.01 },
  { key: 'goalWeight',  label: 'Peso meta',          unit: 'kg',   step: 0.5 },
  { key: 'calorieGoal', label: 'Meta de calorías',   unit: 'kcal', step: 50 },
  { key: 'proteinGoal', label: 'Meta de proteína',   unit: 'g',    step: 5 },
  { key: 'carbsGoal',   label: 'Meta de carbohidr.', unit: 'g',    step: 5 },
  { key: 'fatGoal',     label: 'Meta de grasa',      unit: 'g',    step: 5 },
]

const DAY_TYPE_LABELS: Record<string, string> = {
  upper: 'SUP',
  lower: 'INF',
  null:  'DES',
}

const DAY_TYPE_COLORS: Record<string, string> = {
  upper: 'var(--gt-lime)',
  lower: 'var(--gt-blue)',
  null:  'var(--gt-text-dim)',
}

function cycleType(current: 'upper' | 'lower' | null): 'upper' | 'lower' | null {
  if (current === null) return 'upper'
  if (current === 'upper') return 'lower'
  return null
}

export default function TipsPage() {
  const { settings, updateSettings, resetAllData } = useSettings()
  const [formVals, setFormVals] = useState<Record<string, string>>({})
  const [showReset, setShowReset] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, val: string) => {
    setFormVals((prev) => ({ ...prev, [key]: val }))
  }

  const handleSave = () => {
    const patch: Partial<import('@/lib/types').UserSettings> = {}
    FIELDS.forEach(({ key }) => {
      const raw = formVals[key]
      if (raw !== undefined && raw !== '') {
        ;(patch as unknown as Record<string, number>)[key] = parseFloat(raw)
      }
    })
    updateSettings(patch)
    setFormVals({})
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetAllData()
    setShowReset(false)
  }

  const getVal = (key: string, setting: number) => {
    return formVals[key] !== undefined ? formVals[key] : String(setting)
  }

  const schedule: WorkoutSchedule = settings.workoutSchedule ?? {}

  const handleDayTap = (dayIdx: number) => {
    const current = schedule[dayIdx] ?? null
    const next = cycleType(current)
    updateSettings({ workoutSchedule: { ...schedule, [dayIdx]: next } })
  }

  const bmi = (settings.weight / (settings.height * settings.height)).toFixed(1)

  return (
    <div className="px-4 pt-6 pb-2 flex flex-col gap-5 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-3xl text-lime">Tips & Config</h1>
        <p className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>Reglas, guías y configuración del perfil</p>
      </motion.div>

      {/* Golden Rules */}
      <motion.div
        className="card-dark flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
          Reglas de Oro
        </h2>
        {TIPS.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--gt-border)' }}>
            <span className="shrink-0 mt-0.5">{LUCIDE_ICONS[tip.icon]}</span>
            <p className="text-sm leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </motion.div>

      {/* Progression Guide */}
      <motion.div
        className="card-dark flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      >
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
          Guía de Progresión
        </h2>
        <div className="flex flex-col gap-2">
          {PROGRESSION_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <ChevronRight size={14} color="var(--gt-lime)" className="shrink-0 mt-0.5" />
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Schedule Editor */}
      <motion.div
        className="card-dark flex flex-col gap-4"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
      >
        <div>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
            Horario Semanal
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>
            Tocá cada día para cambiar: DES → SUP → INF → DES
          </p>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAY_NAMES_SHORT.map((name, idx) => {
            const type = schedule[idx] ?? null
            const typeKey = type ?? 'null'
            const color = DAY_TYPE_COLORS[typeKey]
            return (
              <button
                key={idx}
                onClick={() => handleDayTap(idx)}
                className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all active:scale-90"
                style={{
                  background: type ? 'var(--gt-surface2)' : 'var(--gt-surface)',
                  border: `1px solid ${type ? color : 'var(--gt-border)'}`,
                }}
              >
                <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>{name}</span>
                <span className="font-heading font-black text-xs" style={{ color }}>
                  {DAY_TYPE_LABELS[typeKey]}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--gt-text-dim)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gt-lime)' }} />
            SUP = Tren Superior
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gt-blue)' }} />
            INF = Tren Inferior
          </span>
        </div>
      </motion.div>

      {/* Default Weights */}
      <motion.div
        className="card-dark flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}
      >
        <div>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
            Pesos predeterminados
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>
            Peso inicial para cada ejercicio cuando no hay historial
          </p>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>Tren Superior</p>
        {UPPER_EXERCISES.map((ex) => (
          <div key={ex.name} className="flex items-center justify-between gap-3">
            <span className="text-sm flex-1 leading-tight">{ex.name}</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                inputMode="decimal"
                step="2.5"
                className="w-16 rounded-lg px-2 py-1.5 text-center text-sm font-bold outline-none"
                style={{ background: 'var(--gt-surface2)', border: '1px solid var(--gt-border)', color: 'var(--gt-text)' }}
                value={settings.defaultWeights?.[ex.name] ?? ex.defaultWeight}
                onChange={(e) => updateSettings({ defaultWeights: { ...settings.defaultWeights, [ex.name]: parseFloat(e.target.value) || 0 } })}
              />
              <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>kg</span>
            </div>
          </div>
        ))}

        <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--gt-text-dim)' }}>Tren Inferior</p>
        {LOWER_EXERCISES.map((ex) => (
          <div key={ex.name} className="flex items-center justify-between gap-3">
            <span className="text-sm flex-1 leading-tight">{ex.name}</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                inputMode="decimal"
                step="2.5"
                className="w-16 rounded-lg px-2 py-1.5 text-center text-sm font-bold outline-none"
                style={{ background: 'var(--gt-surface2)', border: '1px solid var(--gt-border)', color: 'var(--gt-text)' }}
                value={settings.defaultWeights?.[ex.name] ?? ex.defaultWeight}
                onChange={(e) => updateSettings({ defaultWeights: { ...settings.defaultWeights, [ex.name]: parseFloat(e.target.value) || 0 } })}
              />
              <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>kg</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Profile Editor */}
      <motion.div
        className="card-dark flex flex-col gap-4"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
              Mi Perfil
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>
              IMC actual: <span className="text-lime font-bold">{bmi}</span>
              {' '}<span style={{ color: 'var(--gt-amber)' }}>(bajo peso)</span>
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-heading font-bold text-sm"
            style={{
              background: saved ? 'var(--gt-lime-dim)' : 'var(--gt-lime)',
              color: 'var(--gt-black)',
            }}
            onClick={handleSave}
          >
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(({ key, label, unit, step }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
                {label} <span className="text-xs opacity-60">({unit})</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                step={step}
                className="rounded-xl px-3 py-2.5 text-sm font-bold outline-none w-full"
                style={{
                  background: 'var(--gt-surface2)',
                  border: '1px solid var(--gt-border)',
                  color: 'var(--gt-text)',
                }}
                value={getVal(key, (settings as unknown as Record<string, number>)[key])}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Rest duration */}
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>Descanso entre series</span>
          <div className="flex gap-1.5">
            {[60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => updateSettings({ restDuration: s })}
                className="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: (settings.restDuration ?? 90) === s ? 'var(--gt-lime)' : 'var(--gt-surface2)',
                  color: (settings.restDuration ?? 90) === s ? 'var(--gt-black)' : 'var(--gt-text-dim)',
                }}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="card-dark"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
            Acerca de
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--gt-lime)', color: 'var(--gt-black)', fontWeight: 700 }}>
            v1.0
          </span>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          {[
            ['Objetivo', 'Bulk limpio'],
            ['Equipo', 'Mancuernas + Barra'],
            ['Plan', 'Upper/Lower 4 días/semana'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span style={{ color: 'var(--gt-text-dim)' }}>{label}</span>
              <span className="font-semibold text-lime">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        className="card-dark"
        style={{ borderColor: 'rgba(255, 75, 75, 0.3)' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--gt-red)' }}>
          Zona de Peligro
        </h2>
        <button
          className="w-full py-3 rounded-xl font-heading font-bold text-sm border-2 transition-colors"
          style={{ borderColor: 'var(--gt-red)', color: 'var(--gt-red)', background: 'transparent' }}
          onClick={() => setShowReset(true)}
        >
          Borrar todos los datos
        </button>
      </motion.div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.85)' }}
              onClick={() => setShowReset(false)}
            />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 text-center"
              style={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-center">
                <AlertTriangle size={48} color="var(--gt-amber)" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl">¿Estás seguro?</h3>
                <p className="text-sm mt-2" style={{ color: 'var(--gt-text-dim)' }}>
                  Se borrarán todas tus comidas, entrenamientos, pesos y configuración. Esta acción es irreversible.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--gt-surface2)', color: 'var(--gt-text-dim)' }}
                  onClick={() => setShowReset(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--gt-red)', color: '#fff' }}
                  onClick={handleReset}
                >
                  Borrar todo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
