'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem, clearAll } from '../storage'
import { DEFAULT_SETTINGS } from '../data'
import type { UserSettings } from '../types'

const KEY = 'user-settings'

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(getItem<UserSettings>(KEY, DEFAULT_SETTINGS))
    setHydrated(true)
  }, [])

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    setItem(KEY, updated)
  }, [settings])

  const resetAllData = useCallback(() => {
    clearAll()
    setSettings(DEFAULT_SETTINGS)
    setItem(KEY, DEFAULT_SETTINGS)
  }, [])

  return { settings, hydrated, updateSettings, resetAllData }
}
