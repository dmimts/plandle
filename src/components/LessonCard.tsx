"use client"

import { useState } from 'react'
import type { Lesson } from '@/types'
import { cn } from '@/lib/utils'
import { MapPin, User, FileText, X, Clock } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  style: React.CSSProperties
  isAdmin?: boolean
  onEdit?: (lesson: Lesson) => void
  onDelete?: (id: string) => void
}

export function LessonCard({ lesson, style, isAdmin, onEdit, onDelete }: LessonCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const color = lesson.color || '#0058be'

  return (
    <>
      <div
        className={cn(
          "absolute rounded-lg border overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] flex",
          lesson.is_cancelled
            ? "opacity-60 border-error/30 bg-surface-container dark:bg-gray-800"
            : "border-outline-variant/30 bg-surface-container-lowest dark:bg-gray-800"
        )}
        style={style}
        onClick={() => setShowDetail(true)}
      >
        {/* Color stripe */}
        <div
          className="w-1.5 flex-shrink-0"
          style={{ backgroundColor: lesson.is_cancelled ? '#ba1a1a' : color }}
        />
        <div className="p-2 flex flex-col justify-between w-full overflow-hidden min-w-0">
          <div>
            <p className={cn(
              "font-semibold text-xs leading-tight truncate text-on-surface dark:text-gray-100",
              lesson.is_cancelled && "line-through text-on-surface-variant"
            )}>
              {lesson.subject}
            </p>
            {lesson.is_cancelled && (
              <span className="text-[9px] text-error font-semibold uppercase tracking-wide">Entfällt</span>
            )}
            <p className="text-[10px] text-on-surface-variant dark:text-gray-400 font-mono mt-0.5">
              {lesson.start_time}–{lesson.end_time}
            </p>
          </div>
          <div className="space-y-0.5 mt-1">
            {lesson.teacher && (
              <div className="flex items-center gap-1 text-on-surface-variant dark:text-gray-400">
                <User size={10} className="flex-shrink-0" />
                <span className="text-[10px] truncate">{lesson.teacher}</span>
              </div>
            )}
            {lesson.room && (
              <div className="flex items-center gap-1 text-on-surface-variant dark:text-gray-400">
                <MapPin size={10} className="flex-shrink-0" />
                <span className="text-[10px] truncate">{lesson.room}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal / Bottom Sheet */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowDetail(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6 shadow-2xl z-10"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="w-10 h-1.5 bg-outline-variant rounded-full mx-auto mb-4 md:hidden" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div>
                  <h2 className={cn(
                    "text-xl font-bold text-on-surface dark:text-gray-100",
                    lesson.is_cancelled && "line-through"
                  )}>
                    {lesson.subject}
                  </h2>
                  {lesson.is_cancelled && (
                    <span className="text-xs text-error font-semibold">Stunde entfällt</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wide font-semibold">Uhrzeit</p>
                  <p className="text-sm font-medium text-on-surface dark:text-gray-100">
                    {lesson.start_time} – {lesson.end_time} Uhr
                  </p>
                </div>
              </div>

              {lesson.teacher && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container/30 flex items-center justify-center">
                    <User size={16} className="text-on-primary-container" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wide font-semibold">Lehrkraft</p>
                    <p className="text-sm font-medium text-on-surface dark:text-gray-100">{lesson.teacher}</p>
                  </div>
                </div>
              )}

              {lesson.room && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-tertiary-container/30 flex items-center justify-center">
                    <MapPin size={16} className="text-on-tertiary-container" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wide font-semibold">Raum</p>
                    <p className="text-sm font-medium text-on-surface dark:text-gray-100">{lesson.room}</p>
                  </div>
                </div>
              )}

              {lesson.notes && (
                <div className="bg-surface-container dark:bg-gray-800 rounded-xl p-3 border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-on-surface-variant" />
                    <p className="text-xs text-on-surface-variant uppercase tracking-wide font-semibold">Notizen</p>
                  </div>
                  <p className="text-sm text-on-surface dark:text-gray-200">{lesson.notes}</p>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowDetail(false); onEdit?.(lesson) }}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface dark:text-gray-100 text-sm font-medium hover:bg-surface-container dark:hover:bg-gray-800 transition-colors"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => { setShowDetail(false); onDelete?.(lesson.id) }}
                  className="flex-1 py-2.5 rounded-xl bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors"
                >
                  Löschen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
