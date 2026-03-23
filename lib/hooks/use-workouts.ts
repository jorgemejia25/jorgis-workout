'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem, dateKey } from '../storage'
import { UPPER_EXERCISES, LOWER_EXERCISES, DEFAULT_SETTINGS } from '../data'
import type { WorkoutSession, Exercise, ExerciseSet, ExerciseHistory, UserSettings } from '../types'

function buildExercises(type: 'upper' | 'lower', defaultWeights: Record<string, number>): Exercise[] {
  const templates = type === 'upper' ? UPPER_EXERCISES : LOWER_EXERCISES
  return templates.map((t) => ({
    name: t.name,
    targetSets: t.targetSets,
    targetReps: t.targetReps,
    sets: Array.from({ length: t.targetSets }, () => ({
      reps: 0,
      weight: defaultWeights[t.name] ?? t.defaultWeight,
      completed: false,
    })),
  }))
}

export function useWorkout(date?: Date) {
  const key = dateKey('workouts', date)
  const [workout, setWorkout] = useState<WorkoutSession | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Read schedule dynamically from settings
  const settings = getItem<UserSettings>('user-settings', DEFAULT_SETTINGS)
  const schedule = settings.workoutSchedule ?? DEFAULT_SETTINGS.workoutSchedule
  const todayType = schedule[new Date().getDay()]

  useEffect(() => {
    setWorkout(getItem<WorkoutSession | null>(key, null))
    setHydrated(true)
  }, [key])

  const save = useCallback((updated: WorkoutSession | null) => {
    setWorkout(updated)
    setItem(key, updated)
  }, [key])

  /** Start with the scheduled type for today */
  const startWorkout = useCallback(() => {
    if (!todayType) return
    startWorkoutWithType(todayType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayType])

  /** Start with any type regardless of schedule (for rest-day overrides) */
  const startWorkoutWithType = useCallback((type: 'upper' | 'lower') => {
    const s = getItem<UserSettings>('user-settings', DEFAULT_SETTINGS)
    const dw = s.defaultWeights ?? DEFAULT_SETTINGS.defaultWeights
    const session: WorkoutSession = {
      date: new Date().toISOString().split('T')[0],
      type,
      exercises: buildExercises(type, dw),
      startedAt: Date.now(),
    }
    save(session)
  }, [save])

  const updateSet = useCallback(
    (exerciseIdx: number, setIdx: number, patch: Partial<ExerciseSet>) => {
      if (!workout) return
      const exercises = workout.exercises.map((ex, ei) => {
        if (ei !== exerciseIdx) return ex
        return {
          ...ex,
          sets: ex.sets.map((s, si) =>
            si === setIdx ? { ...s, ...patch } : s
          ),
        }
      })
      save({ ...workout, exercises })
    },
    [workout, save]
  )

  const finishWorkout = useCallback(() => {
    if (!workout) return
    const finished = { ...workout, finishedAt: Date.now() }
    save(finished)

    finished.exercises.forEach((ex) => {
      const histKey = `exercise-history:${ex.name}`
      const history = getItem<ExerciseHistory[]>(histKey, [])
      const entry: ExerciseHistory = {
        date: finished.date,
        sets: ex.sets,
        type: finished.type,
      }
      setItem(histKey, [...history.slice(-20), entry])
    })
  }, [workout, save])

  const getPreviousSession = useCallback((exerciseName: string): ExerciseHistory | null => {
    const history = getItem<ExerciseHistory[]>(`exercise-history:${exerciseName}`, [])
    return history.length > 0 ? history[history.length - 1] : null
  }, [])

  return {
    workout,
    hydrated,
    todayType,
    startWorkout,
    startWorkoutWithType,
    updateSet,
    finishWorkout,
    getPreviousSession,
    isFinished: !!workout?.finishedAt,
    isStarted: !!workout && !workout.finishedAt,
  }
}
