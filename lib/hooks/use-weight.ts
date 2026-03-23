'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem } from '../storage'
import type { WeightEntry } from '../types'

const KEY = 'weight-log'

export function useWeight() {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setEntries(getItem<WeightEntry[]>(KEY, []))
    setHydrated(true)
  }, [])

  const save = useCallback((updated: WeightEntry[]) => {
    setEntries(updated)
    setItem(KEY, updated)
  }, [])

  const addEntry = useCallback((weight: number) => {
    const date = new Date().toISOString().split('T')[0]
    // Replace today's entry if exists
    const filtered = entries.filter((e) => e.date !== date)
    const newEntry: WeightEntry = { id: crypto.randomUUID(), date, weight }
    save([...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
  }, [entries, save])

  const removeEntry = useCallback((id: string) => {
    save(entries.filter((e) => e.id !== id))
  }, [entries, save])

  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weight : null

  const weeklyAverage = (() => {
    if (entries.length < 2) return null
    const recent = entries.slice(-7)
    if (recent.length < 2) return null
    const first = recent[0].weight
    const last = recent[recent.length - 1].weight
    const weeks = recent.length / 7
    return ((last - first) / weeks).toFixed(2)
  })()

  return { entries, hydrated, addEntry, removeEntry, latestWeight, weeklyAverage }
}
