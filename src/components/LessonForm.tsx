"use client"

import { useState } from 'react'
import type { Lesson } from '@/types'
import { DAYS_DE, LESSON_COLORS } from '@/types'
import { X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonFormProps {
  lesson?: Lesson | null
  weekKey: string
  onSave: (lesson: Omit<Lesson, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

export function LessonForm({ lesson, weekKey, onSave, onClose }: LessonFormProps) {
  const [subject, setSubject] = useState(lesson?.subject || '')
  const [teacher, setTeacher] = useState(lesson?.teacher || '')
  const [room, setRoom] = useState(lesson?.room || '')
  const [day, setDay] = useState(lesson?.day ?? 0)
  const [startTime, setStartTime] = useState(lesson?.start_time || '08:00')
  const [endTime, setEndTime] = useState(lesson?.end_time || '09:30')
  const [color, setColor] = useState(lesson?.color || LESSON_COLORS[0].value)
  const [notes, setNotes] = useState(lesson?.notes || '')
  const [isCancelled, setIsCancelled] = useState(lesson?.is_cancelled || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) { setError('Bitte gib einen Fachnamen ein.'); return }
    if (startTime >= endTime) { setError('Die Startzeit muss vor der Endzeit liegen.'); return }

    setLoading(true)
    setError('')
    try {
      await onSave({
        week_key: weekKey,
        day,
        subject: subject.trim(),
        teacher: teacher.trim() || undefined,
        room: room.trim() || undefined,
        start_time: startTime,
        end_time: endTime,
        color,
        notes: notes.trim() || undefined,
        is_cancelled: isCancelled,
      })
      onClose()
    } catch (err) {
      setError('Fehler beim Speichern. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest dark:bg-gray-900 z-10">
          <div className="w-10 h-1.5 bg-outline-variant rounded-full absolute top-3 left-1/2 -translate-x-1/2 md:hidden" />
          <h2 className="font-bold text-lg text-on-surface dark:text-gray-100 mt-2 md:mt-0">
            {lesson ? 'Stunde bearbeiten' : 'Stunde hinzufügen'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Details Section */}
          <div className="bg-surface dark:bg-gray-800 rounded-xl border border-outline-variant/30 p-4 space-y-4">
            <h3 className="font-semibold text-sm text-on-surface dark:text-gray-100 uppercase tracking-wide">Details</h3>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                Fach *
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="z.B. Mathematik"
                required
                className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                Lehrkraft
              </label>
              <input
                type="text"
                value={teacher}
                onChange={e => setTeacher(e.target.value)}
                placeholder="z.B. Dr. Müller"
                className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                Raum
              </label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="z.B. Raum 201"
                className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                Notizen
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="z.B. Lehrbuch mitbringen"
                rows={2}
                className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-surface dark:bg-gray-800 rounded-xl border border-outline-variant/30 p-4 space-y-4">
            <h3 className="font-semibold text-sm text-on-surface dark:text-gray-100 uppercase tracking-wide">Zeitplan</h3>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                Wochentag
              </label>
              <select
                value={day}
                onChange={e => setDay(Number(e.target.value))}
                className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              >
                {DAYS_DE.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                  Beginn
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                  Ende
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-surface-container-lowest dark:bg-gray-700 border border-outline-variant dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-on-surface dark:text-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Color Section */}
          <div className="bg-surface dark:bg-gray-800 rounded-xl border border-outline-variant/30 p-4">
            <h3 className="font-semibold text-sm text-on-surface dark:text-gray-100 uppercase tracking-wide mb-3">Farbe</h3>
            <div className="flex flex-wrap gap-2">
              {LESSON_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-transform hover:scale-110",
                    color === c.value && "ring-2 ring-offset-2 ring-on-surface scale-110"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Cancelled Toggle */}
          <div className="bg-surface dark:bg-gray-800 rounded-xl border border-outline-variant/30 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface dark:text-gray-100">Stunde entfällt</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Als abgesagt markieren</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCancelled(!isCancelled)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                isCancelled ? "bg-error" : "bg-surface-container-high dark:bg-gray-600"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                isCancelled ? "translate-x-7" : "translate-x-1"
              )} />
            </button>
          </div>

          {error && (
            <div className="bg-error-container/30 border border-error/30 rounded-xl px-4 py-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface dark:text-gray-100 text-sm font-semibold hover:bg-surface-container dark:hover:bg-gray-800 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Speichern
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
