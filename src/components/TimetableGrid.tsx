"use client"

import { useMemo, useRef, useEffect } from 'react'
import type { Lesson } from '@/types'
import { DAYS_SHORT_DE } from '@/types'
import { LessonCard } from './LessonCard'
import { TimeIndicator } from './TimeIndicator'
import { timeToMinutes, getWeekStart } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TimetableGridProps {
  lessons: Lesson[]
  weekStart: Date
  selectedDay: number // 0-5
  onDaySelect: (day: number) => void
  viewMode: 'week' | 'day'
  isAdmin?: boolean
  onEditLesson?: (lesson: Lesson) => void
  onDeleteLesson?: (id: string) => void
}

const PIXELS_PER_HOUR = 80
const TIME_COL_WIDTH = 52

export function TimetableGrid({
  lessons,
  weekStart,
  selectedDay,
  onDaySelect,
  viewMode,
  isAdmin,
  onEditLesson,
  onDeleteLesson,
}: TimetableGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Calculate time range from lessons (rounded to full hours)
  const { startHour, endHour } = useMemo(() => {
    if (lessons.length === 0) return { startHour: 7, endHour: 18 }
    const starts = lessons.map(l => Math.floor(timeToMinutes(l.start_time) / 60))
    const ends = lessons.map(l => Math.ceil(timeToMinutes(l.end_time) / 60))
    return {
      startHour: Math.max(0, Math.min(...starts) - 0), // floor to start hour
      endHour: Math.min(18, Math.max(...ends) + 0),    // ceil to end hour, max 18:00
    }
  }, [lessons])

  const hours = useMemo(() => {
    const h = []
    for (let i = startHour; i <= endHour; i++) h.push(i)
    return h
  }, [startHour, endHour])

  const totalHeight = (endHour - startHour) * PIXELS_PER_HOUR

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const startMinutes = startHour * 60
      const offset = ((currentMinutes - startMinutes) / 60) * PIXELS_PER_HOUR
      scrollRef.current.scrollTop = Math.max(0, offset - 100)
    }
  }, [startHour])

  // Get lesson position and height
  const getLessonStyle = (lesson: Lesson, dayIndex: number, totalDays: number): React.CSSProperties => {
    const startMin = timeToMinutes(lesson.start_time)
    const endMin = timeToMinutes(lesson.end_time)
    const startOffset = startHour * 60
    const top = ((startMin - startOffset) / 60) * PIXELS_PER_HOUR
    const height = Math.max(((endMin - startMin) / 60) * PIXELS_PER_HOUR, 30)

    if (viewMode === 'day') {
      return {
        top: `${top}px`,
        height: `${height}px`,
        left: '4px',
        right: '4px',
      }
    }

    // Week view: cards are inside the flex-1 grid area (WITHOUT time column)
    // So 100% here = grid area width only, no TIME_COL_WIDTH offset needed
    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `calc(${dayIndex} * 100% / 6 + 3px)`,
      width: `calc(100% / 6 - 6px)`,
    }
  }

  // Days to show
  const daysToShow = viewMode === 'week' ? [0, 1, 2, 3, 4, 5] : [selectedDay]

  // Today's day index (0=Mon, 5=Sat)
  const todayIndex = useMemo(() => {
    const today = new Date()
    const weekStartDate = getWeekStart(today)
    const currentWeekStart = getWeekStart(weekStart)
    if (weekStartDate.getTime() !== currentWeekStart.getTime()) return -1
    const dayOfWeek = today.getDay()
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sun=0 to Mon=0
  }, [weekStart])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day tabs (mobile) / Day headers (desktop) */}
      <div className={cn(
        "flex border-b border-outline-variant/30 bg-surface-container-lowest dark:bg-gray-900",
        viewMode === 'week' ? "flex overflow-x-auto hide-scrollbar" : "flex overflow-x-auto hide-scrollbar"
      )}>
        {/* Time column spacer – always shown in week view to align with grid */}
        {viewMode === 'week' && (
          <div style={{ width: TIME_COL_WIDTH }} className="flex-shrink-0 border-r border-outline-variant/20 flex items-end justify-center pb-2">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest hidden md:inline">Zeit</span>
          </div>
        )}

        {/* Day headers */}
        {[0,1,2,3,4,5].map(dayIdx => {
          const date = new Date(weekStart)
          date.setDate(date.getDate() + dayIdx)
          const dayNum = date.getDate()
          const isToday = dayIdx === todayIndex
          const isSelected = dayIdx === selectedDay

          // Mobile day view: clickable tabs
          if (viewMode === 'day') {
            return (
              <button
                key={dayIdx}
                onClick={() => onDaySelect(dayIdx)}
                className={cn(
                  "flex flex-col items-center min-w-[56px] py-2 px-3 transition-colors",
                  isSelected
                    ? "text-secondary border-b-2 border-secondary"
                    : "text-on-surface-variant hover:text-on-surface",
                  isToday && !isSelected && "text-on-surface font-bold"
                )}
              >
                <span className="text-[10px] uppercase tracking-widest font-semibold">
                  {DAYS_SHORT_DE[dayIdx]}
                </span>
                <span className={cn(
                  "text-lg font-bold mt-0.5 w-8 h-8 flex items-center justify-center rounded-full",
                  isToday && isSelected && "bg-secondary text-on-secondary",
                  isToday && !isSelected && "bg-secondary/10 text-secondary"
                )}>
                  {dayNum}
                </span>
              </button>
            )
          }

          // Week view header (desktop: static div, mobile: clickable to switch day)
          return (
            <button
              key={dayIdx}
              onClick={() => onDaySelect(dayIdx)}
              className={cn(
                "flex-1 flex flex-col items-center py-2 border-r border-outline-variant/20 last:border-r-0 min-w-[44px] transition-colors",
                isToday && "bg-secondary/5",
                isSelected && "md:bg-transparent"
              )}
            >
              <span className={cn(
                "text-[10px] uppercase tracking-widest font-semibold",
                isToday ? "text-secondary" : "text-on-surface-variant"
              )}>
                {DAYS_SHORT_DE[dayIdx]}
              </span>
              <span className={cn(
                "text-base font-bold mt-0.5 w-7 h-7 flex items-center justify-center rounded-full",
                isToday && "bg-secondary text-on-secondary"
              )}>
                {dayNum}
              </span>
            </button>
          )
        })}
      </div>

      {/* Scrollable grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="relative flex" style={{ height: `${totalHeight}px`, minHeight: `${totalHeight}px` }}>

          {/* Time axis – always shown (week + day, mobile + desktop) */}
          <div
            className="flex-shrink-0 border-r border-outline-variant/20 bg-surface-container-lowest dark:bg-gray-900 sticky left-0 z-10"
            style={{ width: TIME_COL_WIDTH }}
          >
            {hours.map((hour, i) => (
              <div
                key={hour}
                className="absolute flex items-start justify-end pr-2 pt-1"
                style={{
                  top: `${i * PIXELS_PER_HOUR}px`,
                  height: `${PIXELS_PER_HOUR}px`,
                  width: TIME_COL_WIDTH,
                }}
              >
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Grid area */}
          <div className="flex-1 relative">
            {/* Horizontal hour lines */}
            {hours.map((hour, i) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-outline-variant/20"
                style={{ top: `${i * PIXELS_PER_HOUR}px` }}
              />
            ))}

            {/* Vertical day separators (week view) */}
            {viewMode === 'week' && [1,2,3,4,5].map(i => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-outline-variant/20"
                style={{ left: `${(i / 6) * 100}%` }}
              />
            ))}

            {/* Today column highlight */}
            {viewMode === 'week' && todayIndex >= 0 && todayIndex <= 5 && (
              <div
                className="absolute top-0 bottom-0 bg-secondary/3 pointer-events-none"
                style={{
                  left: `${(todayIndex / 6) * 100}%`,
                  width: `${(1 / 6) * 100}%`,
                }}
              />
            )}

            {/* Time indicator */}
            <TimeIndicator startHour={startHour} pixelsPerHour={PIXELS_PER_HOUR} />

            {/* Lesson cards */}
            {lessons
              .filter(l => viewMode === 'day' ? l.day === selectedDay : true)
              .map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  style={getLessonStyle(lesson, lesson.day, 6)}
                  isAdmin={isAdmin}
                  onEdit={onEditLesson}
                  onDelete={onDeleteLesson}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
