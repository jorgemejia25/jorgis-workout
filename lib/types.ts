export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  timestamp: number
}

export interface PredefinedMeal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MacroTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface ExerciseSet {
  reps: number
  weight: number
  completed: boolean
}

export interface Exercise {
  name: string
  targetSets: number
  targetReps: string
  sets: ExerciseSet[]
}

export interface WorkoutSession {
  date: string
  type: 'upper' | 'lower'
  exercises: Exercise[]
  startedAt: number
  finishedAt?: number
}

export interface ExerciseHistory {
  date: string
  sets: ExerciseSet[]
  type: 'upper' | 'lower'
}

export interface WeightEntry {
  id: string
  date: string
  weight: number
}

export type WorkoutSchedule = Record<number, 'upper' | 'lower' | null>

export interface UserSettings {
  weight: number
  height: number
  goalWeight: number
  calorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
  unit: 'kg' | 'lb'
  workoutSchedule: WorkoutSchedule
  defaultWeights: Record<string, number>
  restDuration: number
}

export interface StreakData {
  count: number
  lastDate: string
}
