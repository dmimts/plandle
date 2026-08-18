"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, signOut } from '@/lib/auth'
import { getLessonsForWeek, createLesson, updateLesson, deleteLesson } from '@/lib/lessons'
import { WeekNav } from '@/components/WeekNav'
import { TimetableGrid } from '@/components/TimetableGrid'
import { LessonForm } from '@/components/LessonForm'
import { getWeekStart, getWeekKey } from '@/lib/utils'
import type { Lesson } from '@/types'
import { Plus, LogOut, CalendarDays, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDay, setSelectedDay] = useState(0)
  const router = useRouter()

  useEffect(() => {
    getUser().then(u => {
      if (!u) router.push('/admin/login')
      else setUser(u)
    })
  }, [router])

  const loadLessons = useCallback(async () => {
    setLoading(true)
    const weekKey = getWeekKey(weekStart)
    const data = await getLessonsForWeek(weekKey)
    setLessons(data)
    setLoading(false)
  }, [weekStart])

  useEffect(() => {
    if (user) loadLessons()
  }, [user, loadLessons])

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) setViewMode('day')
      else setViewMode('week')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSaveLesson = async (lessonData: Omit<Lesson, 'id' | 'created_at'>) => {
    if (editingLesson) {
      await updateLesson(editingLesson.id, lessonData)
    } else {
      await createLesson(lessonData)
    }
    await loadLessons()
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Stunde wirklich löschen?')) return
    await deleteLesson(id)
    await loadLessons()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-950 overflow-hidden">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 h-16 bg-surface/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-outline-variant/30 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-secondary" />
          <div>
            <h1 className="font-bold text-base text-primary dark:text-gray-100 leading-tight">Admin</h1>
            <p className="text-xs text-on-surface-variant leading-tight">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
            title="Zum Stundenplan"
          >
            <Home size={18} />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
            title="Abmelden"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Week Navigation */}
      <WeekNav currentWeekStart={weekStart} onWeekChange={setWeekStart} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col pb-20 md:pb-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-on-surface-variant">Lade Stundenplan…</p>
            </div>
          </div>
        ) : (
          <TimetableGrid
            lessons={lessons}
            weekStart={weekStart}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            viewMode={viewMode}
            isAdmin={true}
            onEditLesson={(lesson) => { setEditingLesson(lesson); setShowForm(true) }}
            onDeleteLesson={handleDeleteLesson}
          />
        )}
      </main>

      {/* FAB - Add Lesson */}
      <button
        onClick={() => { setEditingLesson(null); setShowForm(true) }}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-secondary text-on-secondary rounded-2xl shadow-lg hover:shadow-xl hover:bg-secondary/90 transition-all flex items-center justify-center z-40"
        aria-label="Stunde hinzufügen"
      >
        <Plus size={24} />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-outline-variant/30 flex items-center justify-around px-4 z-40">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Home size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Stundenplan</span>
        </Link>
        <button
          onClick={() => { setEditingLesson(null); setShowForm(true) }}
          className="flex flex-col items-center gap-0.5 text-secondary"
        >
          <Plus size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Hinzufügen</span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-0.5 text-on-surface-variant"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Abmelden</span>
        </button>
      </nav>

      {/* Lesson Form Modal */}
      {showForm && (
        <LessonForm
          lesson={editingLesson}
          weekKey={getWeekKey(weekStart)}
          onSave={handleSaveLesson}
          onClose={() => { setShowForm(false); setEditingLesson(null) }}
        />
      )}
    </div>
  )
}
