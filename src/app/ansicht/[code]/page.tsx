"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { validateShareCode, getLessonsForWeek } from '@/lib/lessons'
import { WeekNav } from '@/components/WeekNav'
import { TimetableGrid } from '@/components/TimetableGrid'
import { getWeekStart, getWeekKey } from '@/lib/utils'
import type { Lesson } from '@/types'
import { CalendarDays, Eye, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AnsichtPage() {
  const params = useParams()
  const code = params.code as string

  const [valid, setValid] = useState<boolean | null>(null)
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    validateShareCode(code).then(isValid => {
      setValid(isValid)
      if (!isValid) setLoading(false)
    })
  }, [code])

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) setViewMode('day')
      else setViewMode('week')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadLessons = useCallback(async () => {
    if (!valid) return
    setLoading(true)
    const weekKey = getWeekKey(weekStart)
    const data = await getLessonsForWeek(weekKey)
    setLessons(data)
    setLoading(false)
  }, [weekStart, valid])

  useEffect(() => {
    if (valid) loadLessons()
  }, [valid, loadLessons])

  if (valid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-error" />
          </div>
          <h1 className="text-xl font-bold text-on-surface dark:text-gray-100 mb-2">Ungültiger Link</h1>
          <p className="text-sm text-on-surface-variant mb-6">
            Dieser Einladungslink ist ungültig oder abgelaufen. Bitte frage nach einem neuen Link.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            <CalendarDays size={16} />
            Zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 bg-surface/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-outline-variant/30 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-secondary" />
          <h1 className="font-bold text-lg text-primary dark:text-gray-100">Stundenplan</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
          <Eye size={14} />
          <span className="text-xs font-semibold">Nur lesen</span>
        </div>
      </header>

      {/* Week Navigation */}
      <WeekNav currentWeekStart={weekStart} onWeekChange={setWeekStart} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-on-surface-variant">Stundenplan wird geladen…</p>
            </div>
          </div>
        ) : (
          <TimetableGrid
            lessons={lessons}
            weekStart={weekStart}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            viewMode={viewMode}
            isAdmin={false}
          />
        )}
      </main>
    </div>
  )
}
