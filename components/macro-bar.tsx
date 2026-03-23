'use client'

import { motion } from 'motion/react'

interface MacroBarProps {
  label: string
  current: number
  goal: number
  color: string
  unit?: string
}

function MacroBar({ label, current, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((current / goal) * 100, 100)
  const over = current > goal

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--gt-text-dim)' }}>{label}</span>
        <span className="font-semibold" style={{ color: over ? 'var(--gt-amber)' : 'var(--gt-text)' }}>
          {current}<span style={{ color: 'var(--gt-text-dim)' }}> / {goal}{unit}</span>
        </span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--gt-surface2)' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: over ? 'var(--gt-amber)' : color }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

interface MacroBarsProps {
  protein: number
  carbs: number
  fat: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
}

export function MacroBars({ protein, carbs, fat, proteinGoal, carbsGoal, fatGoal }: MacroBarsProps) {
  return (
    <div className="flex flex-col gap-3 p-4 card-dark">
      <h3 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>
        Macros
      </h3>
      <MacroBar label="Proteína" current={protein} goal={proteinGoal} color="var(--gt-lime)" />
      <MacroBar label="Carbohidratos" current={carbs} goal={carbsGoal} color="var(--gt-blue)" />
      <MacroBar label="Grasa" current={fat} goal={fatGoal} color="var(--gt-amber)" />
    </div>
  )
}
