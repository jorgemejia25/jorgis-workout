'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Scale } from 'lucide-react'
import { useWeight } from '@/lib/hooks/use-weight'
import { useSettings } from '@/lib/hooks/use-settings'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Dot
} from 'recharts'

export default function PesoPage() {
  const { entries, addEntry, removeEntry, latestWeight, weeklyAverage } = useWeight()
  const { settings, updateSettings } = useSettings()
  const [inputVal, setInputVal] = useState('')
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    const val = parseFloat(inputVal)
    if (!val || val <= 0) return
    const weightKg = unit === 'lb' ? +(val / 2.20462).toFixed(1) : val
    addEntry(weightKg)
    // Update current weight in settings
    updateSettings({ weight: weightKg })
    setInputVal('')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const chartData = entries.map((e) => ({
    date: e.date.slice(5).replace('-', '/'),
    weight: e.weight,
    id: e.id,
  }))

  const minWeight = entries.length > 0 ? Math.min(...entries.map((e) => e.weight)) - 1 : 45
  const maxWeight = entries.length > 0 ? Math.max(...entries.map((e) => e.weight), settings.goalWeight) + 2 : 70

  const diff = latestWeight !== null ? latestWeight - settings.weight : null
  const goalDiff = latestWeight !== null ? settings.goalWeight - latestWeight : settings.goalWeight - settings.weight

  return (
    <div className="px-4 pt-6 pb-2 flex flex-col gap-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-3xl text-lime">Peso</h1>
        <p className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>Registro semanal de peso corporal</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <div className="card-dark text-center py-3">
          <p className="font-heading font-black text-xl text-lime">
            {latestWeight !== null ? `${latestWeight}` : settings.weight}
          </p>
          <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>kg actual</p>
        </div>
        <div className="card-dark text-center py-3">
          <p className="font-heading font-black text-xl" style={{ color: 'var(--gt-blue)' }}>
            {settings.goalWeight}
          </p>
          <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>kg meta</p>
        </div>
        <div className="card-dark text-center py-3">
          <p className="font-heading font-black text-xl" style={{ color: goalDiff > 0 ? 'var(--gt-amber)' : 'var(--gt-lime)' }}>
            {goalDiff > 0 ? `+${goalDiff.toFixed(1)}` : '✓'}
          </p>
          <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>para la meta</p>
        </div>
      </motion.div>

      {/* Weekly average */}
      {weeklyAverage !== null && (
        <div className="card-dark flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--gt-text-dim)' }}>Ganancia promedio semanal</span>
          <span className="font-heading font-black text-lime">
            {Number(weeklyAverage) >= 0 ? '+' : ''}{weeklyAverage} kg
          </span>
        </div>
      )}

      {/* Input */}
      <motion.div
        className="card-dark flex flex-col gap-3"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm">Registrar peso</h2>
          {/* kg / lb toggle */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--gt-border)' }}>
            {(['kg', 'lb'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className="px-3 py-1 text-xs font-bold transition-colors"
                style={{
                  background: unit === u ? 'var(--gt-lime)' : 'var(--gt-surface2)',
                  color: unit === u ? 'var(--gt-black)' : 'var(--gt-text-dim)',
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            className="flex-1 rounded-xl px-4 py-3 text-center text-xl font-heading font-black outline-none"
            style={{
              background: 'var(--gt-surface2)',
              border: '1px solid var(--gt-border)',
              color: 'var(--gt-text)',
            }}
            placeholder={unit === 'kg' ? '52.6' : '116'}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button
            className="px-6 rounded-xl font-heading font-bold text-sm shrink-0 transition-all"
            style={{
              background: added ? 'var(--gt-lime-dim)' : 'var(--gt-lime)',
              color: 'var(--gt-black)',
            }}
            onClick={handleAdd}
          >
            {added ? '✓ Guardado' : 'Guardar'}
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--gt-text-dim)' }}>
          Pesate en ayunas, por la mañana y sin ropa para mayor precisión.
        </p>
      </motion.div>

      {/* Chart */}
      {entries.length >= 2 && (
        <motion.div
          className="card-dark"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm">Progresión de peso</h2>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--gt-text-dim)' }}>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block bg-lime rounded"></span> Actual</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded" style={{ background: 'var(--gt-blue)' }}></span> Meta</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid stroke="var(--gt-border)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--gt-text-dim)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[minWeight, maxWeight]}
                tick={{ fill: 'var(--gt-text-dim)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--gt-surface)',
                  border: '1px solid var(--gt-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--gt-text-dim)' }}
                itemStyle={{ color: 'var(--gt-lime)' }}
                formatter={(v) => [`${v} kg`, 'Peso']}
              />
              <ReferenceLine
                y={settings.goalWeight}
                stroke="var(--gt-blue)"
                strokeDasharray="6 3"
                label={{ value: `Meta ${settings.goalWeight}kg`, position: 'right', fill: 'var(--gt-blue)', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--gt-lime)"
                strokeWidth={2.5}
                dot={<Dot r={3} fill="var(--gt-lime)" stroke="var(--gt-black)" strokeWidth={2} />}
                activeDot={{ r: 5, fill: 'var(--gt-lime)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* History list */}
      {entries.length > 0 && (
        <div>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--gt-text-dim)' }}>
            Historial
          </h2>
          <div className="flex flex-col gap-2">
            {[...entries].reverse().map((entry, i) => {
              const prev = entries[entries.length - 2 - i]
              const delta = prev ? entry.weight - prev.weight : null
              return (
                <div key={entry.id} className="card-dark flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{entry.date}</p>
                    {delta !== null && (
                      <p className="text-xs" style={{ color: delta >= 0 ? 'var(--gt-lime)' : 'var(--gt-red)' }}>
                        {delta >= 0 ? '+' : ''}{delta.toFixed(1)} kg
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-xl text-lime">{entry.weight} kg</span>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-sm"
                      style={{ background: 'var(--gt-surface2)', color: 'var(--gt-red)' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-12 flex flex-col items-center gap-3" style={{ color: 'var(--gt-text-dim)' }}>
          <Scale size={40} />
          <p className="text-sm">Aún no tenés registros de peso.</p>
          <p className="text-xs">Registrá tu primer peso arriba.</p>
        </div>
      )}
    </div>
  )
}
