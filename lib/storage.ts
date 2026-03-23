const isBrowser = typeof window !== 'undefined'

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function removeItem(key: string): void {
  if (!isBrowser) return
  localStorage.removeItem(key)
}

export function clearAll(): void {
  if (!isBrowser) return
  localStorage.clear()
}

/** Returns the key for a date-scoped record, e.g. "meals:2025-03-22" */
export function dateKey(prefix: string, date?: Date): string {
  const d = date ?? new Date()
  return `${prefix}:${d.toISOString().split('T')[0]}`
}

/** Returns today's date as YYYY-MM-DD */
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

/** Returns yesterday's date as YYYY-MM-DD */
export function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}
