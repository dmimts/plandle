"use client"

import { useState, useEffect, useCallback } from 'react'
import { WeekNav } from '@/components/WeekNav'
import { TimetableGrid } from '@/components/TimetableGrid'
import { getWeekStart, getWeekKey } from '@/lib/utils'
import { getLessonsForWeek } from '@/lib/lessons'
import type { Lesson } from '@/types'
import { useTheme } from 'next-themes'
import { Sun, Moon, Share2, Settings, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date()
    const day = today.getDay()
    return day === 0 ? 0 : day - 1 // Mon=0, Sat=5
  })
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const loadLessons = useCallback(async () => {
    setLoading(true)
    const weekKey = getWeekKey(weekStart)
    const data = await getLessonsForWeek(weekKey)
    setLessons(data)
    setLoading(false)
  }, [weekStart])

  useEffect(() => {
    loadLessons()
  }, [loadLessons])

  // Switch to day view on mobile automatically
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) setViewMode('day')
      else setViewMode('week')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-950 overflow-hidden">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 h-16 bg-surface/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-outline-variant/30 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-secondary" />
          <h1 className="font-bold text-lg text-primary dark:text-gray-100">Plandle</h1>
        </div>
        <div className="flex items-center gap-1">
          {/* View toggle (desktop) */}
          <div className="hidden md:flex bg-surface-container dark:bg-gray-800 rounded-full p-1 mr-2">
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                viewMode === 'week'
                  ? "bg-surface-container-lowest dark:bg-gray-700 text-on-surface dark:text-gray-100 shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Woche
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                viewMode === 'day'
                  ? "bg-surface-container-lowest dark:bg-gray-700 text-on-surface dark:text-gray-100 shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Tag
            </button>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
              aria-label="Design wechseln"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <Link
            href="/teilen"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
            aria-label="Teilen"
          >
            <Share2 size={18} />
          </Link>
          <Link
            href="/admin"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
            aria-label="Einstellungen"
          >
            <Settings size={18} />
          </Link>
        </div>
      </header>

      {/* Week Navigation */}
      <WeekNav currentWeekStart={weekStart} onWeekChange={setWeekStart} />

      {/* View toggle (mobile) */}
      <div className="md:hidden flex bg-surface-container-lowest dark:bg-gray-900 border-b border-outline-variant/30 px-4 py-2">
        <div className="flex bg-surface-container dark:bg-gray-800 rounded-full p-1 w-full max-w-[200px] mx-auto">
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              "flex-1 py-1 rounded-full text-xs font-semibold transition-colors",
              viewMode === 'week'
                ? "bg-surface-container-lowest dark:bg-gray-700 text-on-surface dark:text-gray-100 shadow-sm"
                : "text-on-surface-variant"
            )}
          >
            Woche
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={cn(
              "flex-1 py-1 rounded-full text-xs font-semibold transition-colors",
              viewMode === 'day'
                ? "bg-surface-container-lowest dark:bg-gray-700 text-on-surface dark:text-gray-100 shadow-sm"
                : "text-on-surface-variant"
            )}
          >
            Tag
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col pb-16 md:pb-0">
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

      {/* Bottom Nav (mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-outline-variant/30 flex items-center justify-around px-4 z-40">
        <button
          onClick={() => { setWeekStart(getWeekStart(new Date())); setSelectedDay(new Date().getDay() === 0 ? 0 : new Date().getDay() - 1) }}
          className="flex flex-col items-center gap-0.5 text-secondary"
        >
          <CalendarDays size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Heute</span>
        </button>
        <Link href="/teilen" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Share2 size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Teilen</span>
        </Link>
        <Link href="/admin" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Settings size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Admin</span>
        </Link>
      </nav>
    </div>
  )
}
