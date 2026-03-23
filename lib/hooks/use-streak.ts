'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem, today, yesterday } from '../storage'
import type { StreakData } from '../types'

const KEY = 'streak'
const DEFAULTS: StreakData = { count: 0, lastDate: '' }

export function useStreak() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const data = getItem<StreakData>(KEY, DEFAULTS)
    const t = today()
    const y = yesterday()

    if (data.lastDate === t || data.lastDate === y) {
      setStreak(data.count)
    } else {
      // Reset — too many days missed
      setStreak(0)
    }
  }, [])

  const incrementStreak = useCallback(() => {
    const t = today()
    const data = getItem<StreakData>(KEY, DEFAULTS)
    if (data.lastDate === t) return // already logged today

    const newCount = data.lastDate === yesterday() ? data.count + 1 : 1
    const updated: StreakData = { count: newCount, lastDate: t }
    setStreak(newCount)
    setItem(KEY, updated)
  }, [])

  return { streak, incrementStreak }
}
