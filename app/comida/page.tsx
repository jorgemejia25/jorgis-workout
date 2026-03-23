'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMeals } from '@/lib/hooks/use-meals'
import { useSettings } from '@/lib/hooks/use-settings'
import { useStreak } from '@/lib/hooks/use-streak'
import { PREDEFINED_MEALS } from '@/lib/data'
import type { PredefinedMeal } from '@/lib/types'

interface CustomMealForm {
  name: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

const EMPTY_FORM: CustomMealForm = { name: '', calories: '', protein: '', carbs: '', fat: '' }

export default function ComidaPage() {
  const { meals, totals, addMeal, removeMeal } = useMeals()
  const { settings } = useSettings()
  const { incrementStreak } = useStreak()
  const [dateStr, setDateStr] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'short' }))
  }, [])
  const [form, setForm] = useState<CustomMealForm>(EMPTY_FORM)
  const [addedId, setAddedId] = useState<string | null>(null)

  const remaining = settings.calorieGoal - totals.calories

  const handleQuickAdd = (meal: PredefinedMeal) => {
    addMeal(meal)
    incrementStreak()
    // Visual feedback
    setAddedId(meal.name)
    setTimeout(() => setAddedId(null), 800)
  }

  const handleCustomAdd = () => {
    if (!form.name || !form.calories) return
    addMeal({
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    })
    incrementStreak()
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  }

  return (
    <div className="px-4 pt-6 pb-2 flex flex-col gap-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-black text-3xl text-lime">Comida</h1>
          <p className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>
            {dateStr}
          </p>
        </div>
        <div className="card-dark text-right px-3 py-2">
          <p className="font-heading font-black text-xl" style={{ color: remaining >= 0 ? 'var(--gt-lime)' : 'var(--gt-amber)' }}>
            {remaining >= 0 ? remaining : Math.abs(remaining)}
          </p>
          <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
            {remaining >= 0 ? 'kcal restantes' : 'kcal sobre meta'}
          </p>
        </div>
      </div>

      {/* Quick totals bar */}
      <div className="card-dark flex items-center justify-around py-3">
        {[
          { label: 'Cal', value: totals.calories, color: 'var(--gt-lime)' },
          { label: 'Prot', value: `${totals.protein}g`, color: 'var(--gt-lime)' },
          { label: 'Carb', value: `${totals.carbs}g`, color: 'var(--gt-blue)' },
          { label: 'Gras', value: `${totals.fat}g`, color: 'var(--gt-amber)' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <span className="font-heading font-bold text-base" style={{ color: item.color }}>{item.value}</span>
            <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Predefined meals grid */}
      <div>
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--gt-text-dim)' }}>
          Agregar comida rápida
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {PREDEFINED_MEALS.map((meal) => {
            const isAdded = addedId === meal.name
            return (
              <motion.button
                key={meal.name}
                className="card-dark text-left active:scale-95 transition-all text-sm"
                style={{
                  borderColor: isAdded ? 'var(--gt-lime)' : 'var(--gt-border)',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAdd(meal)}
              >
                <p className="font-semibold leading-tight mb-1" style={{ color: isAdded ? 'var(--gt-lime)' : 'var(--gt-text)' }}>
                  {isAdded ? '✓ Agregado' : meal.name}
                </p>
                <p className="font-heading font-black text-lg text-lime">
                  {meal.calories} <span className="text-xs font-normal" style={{ color: 'var(--gt-text-dim)' }}>kcal</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--gt-text-dim)' }}>
                  P:{meal.protein} C:{meal.carbs} G:{meal.fat}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Custom meal button */}
      <button
        className="w-full py-3 rounded-xl font-heading font-bold text-sm tracking-wide border-2 transition-colors"
        style={{
          borderColor: 'var(--gt-lime)',
          color: 'var(--gt-lime)',
          background: 'transparent',
        }}
        onClick={() => setShowModal(true)}
      >
        + Comida personalizada
      </button>

      {/* Daily log */}
      {meals.length > 0 && (
        <div>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--gt-text-dim)' }}>
            Registro del día
          </h2>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {[...meals].reverse().map((meal) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="card-dark flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{meal.name}</p>
                    <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
                      {formatTime(meal.timestamp)} · {meal.calories} kcal · P:{meal.protein} C:{meal.carbs} G:{meal.fat}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--gt-red)', background: 'var(--gt-surface2)' }}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Custom meal modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.8)' }}
              onClick={() => setShowModal(false)}
            />
            {/* Sheet */}
            <motion.div
              className="relative w-full max-w-lg mx-auto rounded-t-2xl p-5 pb-8 flex flex-col gap-4"
              style={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)', borderBottom: 'none' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl">Comida personalizada</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl leading-none"
                  style={{ color: 'var(--gt-text-dim)' }}
                >×</button>
              </div>

              <input
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
                style={{
                  background: 'var(--gt-surface2)',
                  border: '1px solid var(--gt-border)',
                  color: 'var(--gt-text)',
                }}
                placeholder="Nombre de la comida"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'calories', label: 'Calorías (kcal)' },
                  { key: 'protein',  label: 'Proteína (g)' },
                  { key: 'carbs',    label: 'Carbohidratos (g)' },
                  { key: 'fat',      label: 'Grasa (g)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--gt-text-dim)' }}>{label}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                      style={{
                        background: 'var(--gt-surface2)',
                        border: '1px solid var(--gt-border)',
                        color: 'var(--gt-text)',
                      }}
                      placeholder="0"
                      value={form[key as keyof CustomMealForm]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <button
                className="w-full py-3.5 rounded-xl font-heading font-bold tracking-wide"
                style={{ background: 'var(--gt-lime)', color: 'var(--gt-black)' }}
                onClick={handleCustomAdd}
              >
                Agregar comida
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
