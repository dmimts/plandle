export interface Lesson {
  id: string
  week_key: string // e.g. "2024-W42"
  day: number // 0=Monday, 1=Tuesday, ..., 5=Saturday
  subject: string
  teacher?: string
  room?: string
  start_time: string // "HH:MM"
  end_time: string // "HH:MM"
  color: string // hex color
  notes?: string
  is_cancelled?: boolean
  created_at?: string
}

export interface Week {
  id: string
  week_key: string
  label?: string
  created_at?: string
}

export interface ShareCode {
  id: string
  code: string
  created_at?: string
  expires_at?: string | null
}

export const DAYS_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
export const DAYS_SHORT_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

export const LESSON_COLORS = [
  { name: 'Blau', value: '#0058be' },
  { name: 'Grün', value: '#00a472' },
  { name: 'Lila', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Teal', value: '#0891b2' },
  { name: 'Indigo', value: '#4338ca' },
  { name: 'Rot', value: '#ba1a1a' },
]
