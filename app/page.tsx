'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Flame, Moon, ChevronRight, CheckCircle } from 'lucide-react'
import { CalorieRing } from '@/components/calorie-ring'
import { MacroBars } from '@/components/macro-bar'
import { useMeals } from '@/lib/hooks/use-meals'
import { useSettings } from '@/lib/hooks/use-settings'
import { useStreak } from '@/lib/hooks/use-streak'
import { useWorkout } from '@/lib/hooks/use-workouts'
import { useWeight } from '@/lib/hooks/use-weight'
import Link from 'next/link'
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const WORKOUT_LABELS = {
  upper: 'Tren Superior',
  lower: 'Tren Inferior',
}

function stagger(i: number) {
  return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.08 } }
}

export default function DashboardPage() {
  const { totals } = useMeals()
  const { settings } = useSettings()
  const { streak } = useStreak()
  const { todayType, isFinished } = useWorkout()
  const { entries } = useWeight()
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const now = new Date()
    setDateStr(now.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' }))
  }, [])

  const now = new Date()

  // Next workout after today
  const schedule = settings.workoutSchedule
  const nextWorkout = (() => {
    for (let i = 1; i <= 7; i++) {
      const day = (now.getDay() + i) % 7
      if (schedule?.[day]) {
        return { day: DAY_NAMES[day], type: schedule[day]! }
      }
    }
    return null
  })()

  // Weight chart — last 7 entries
  const chartData = entries.slice(-7).map((e) => ({
    date: e.date.slice(5),
    weight: e.weight,
  }))

  return (
    <div className="px-4 pt-6 pb-2 flex flex-col gap-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div {...stagger(0)}>
        <h1 className="font-heading font-black text-3xl text-lime">GainTrack</h1>
        <p className="text-sm capitalize" style={{ color: 'var(--gt-text-dim)' }}>{dateStr}</p>
      </motion.div>

      {/* Calorie Ring */}
      <motion.div {...stagger(1)} className="flex justify-center py-2">
        <CalorieRing consumed={totals.calories} goal={settings.calorieGoal} />
      </motion.div>

      {/* Macro Bars */}
      <motion.div {...stagger(2)}>
        <MacroBars
          protein={totals.protein}   proteinGoal={settings.proteinGoal}
          carbs={totals.carbs}       carbsGoal={settings.carbsGoal}
          fat={totals.fat}           fatGoal={settings.fatGoal}
        />
      </motion.div>

      {/* Streak + Workout */}
      <motion.div {...stagger(3)} className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="card-dark flex flex-col items-center justify-center py-4 gap-1">
          <Flame size={28} color="var(--gt-amber)" />
          <span className="font-heading font-black text-2xl text-lime">{streak}</span>
          <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>días seguidos</span>
        </div>

        {/* Today's workout */}
        <Link href="/workout" className="card-dark flex flex-col justify-center py-4 px-3 gap-1 active:scale-95 transition-transform">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--gt-text-dim)' }}>
            Hoy
          </span>
          {todayType ? (
            <>
              <span className="font-heading font-bold text-sm text-lime">
                {WORKOUT_LABELS[todayType]}
              </span>
              <span className="text-xs flex items-center gap-1" style={{ color: isFinished ? 'var(--gt-lime-dim)' : 'var(--gt-text-dim)' }}>
                {isFinished
                  ? <><CheckCircle size={12} /> Completado</>
                  : <>Pendiente <ChevronRight size={12} /></>
                }
              </span>
            </>
          ) : (
            <>
              <span className="font-heading font-bold text-sm flex items-center gap-1.5" style={{ color: 'var(--gt-text-dim)' }}>
                <Moon size={14} /> Descanso
              </span>
              {nextWorkout && (
                <span className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
                  Próx: {nextWorkout.day}
                </span>
              )}
            </>
          )}
        </Link>
      </motion.div>

      {/* Weight Trend */}
      {chartData.length >= 2 && (
        <motion.div {...stagger(4)} className="card-dark">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--gt-text-dim)' }}>
              Tendencia de Peso
            </h3>
            <Link href="/peso" className="text-xs text-lime">Ver todo →</Link>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--gt-lime)"
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                contentStyle={{ background: 'var(--gt-surface)', border: '1px solid var(--gt-border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--gt-text-dim)' }}
                itemStyle={{ color: 'var(--gt-lime)' }}
                formatter={(v) => [`${v} kg`, '']}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* IMC + Current weight */}
      <motion.div {...stagger(5)} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Peso', value: `${settings.weight} kg`, sub: '' },
          { label: 'Altura', value: `${settings.height} m`, sub: '' },
          { label: 'IMC', value: (settings.weight / (settings.height * settings.height)).toFixed(1), sub: 'bajo' },
        ].map((item) => (
          <div key={item.label} className="card-dark flex flex-col items-center py-3 gap-0.5">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--gt-text-dim)' }}>{item.label}</span>
            <span className="font-heading font-bold text-lg text-lime">{item.value}</span>
            {item.sub && <span className="text-xs" style={{ color: 'var(--gt-amber)' }}>{item.sub}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
