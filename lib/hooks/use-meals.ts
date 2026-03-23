'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem, dateKey } from '../storage'
import type { Meal, MacroTotals, PredefinedMeal } from '../types'

function computeTotals(meals: Meal[]): MacroTotals {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein:  acc.protein  + m.protein,
      carbs:    acc.carbs    + m.carbs,
      fat:      acc.fat      + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export function useMeals(date?: Date) {
  const key = dateKey('meals', date)
  const [meals, setMeals] = useState<Meal[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setMeals(getItem<Meal[]>(key, []))
    setHydrated(true)
  }, [key])

  const save = useCallback((updated: Meal[]) => {
    setMeals(updated)
    setItem(key, updated)
  }, [key])

  const addMeal = useCallback((meal: PredefinedMeal | Omit<Meal, 'id' | 'timestamp'>) => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...meal,
    }
    save([...meals, newMeal])
  }, [meals, save])

  const removeMeal = useCallback((id: string) => {
    save(meals.filter((m) => m.id !== id))
  }, [meals, save])

  return {
    meals,
    hydrated,
    addMeal,
    removeMeal,
    totals: computeTotals(meals),
  }
}
