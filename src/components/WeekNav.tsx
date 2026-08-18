"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getWeekNumber, getWeekStart } from '@/lib/utils'
import { format, addWeeks } from 'date-fns'
import { de } from 'date-fns/locale'

interface WeekNavProps {
  currentWeekStart: Date
  onWeekChange: (newWeekStart: Date) => void
}

export function WeekNav({ currentWeekStart, onWeekChange }: WeekNavProps) {
  const weekEnd = new Date(currentWeekStart)
  weekEnd.setDate(weekEnd.getDate() + 5) // Saturday

  const weekNum = getWeekNumber(currentWeekStart)
  const year = currentWeekStart.getFullYear()

  const startLabel = format(currentWeekStart, 'd. MMM', { locale: de })
  const endLabel = format(weekEnd, 'd. MMM', { locale: de })

  const isCurrentWeek = (() => {
    const now = getWeekStart(new Date())
    return now.getTime() === currentWeekStart.getTime()
  })()

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest dark:bg-gray-900">
      <button
        onClick={() => onWeekChange(addWeeks(currentWeekStart, -1))}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 transition-colors text-on-surface-variant"
        aria-label="Vorherige Woche"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base text-on-surface dark:text-gray-100">
            {startLabel} – {endLabel}
          </h2>
          {isCurrentWeek && (
            <span className="text-xs bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-medium">
              Heute
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5 tracking-widest uppercase">
          KW {weekNum} · {year}
        </p>
      </div>

      <button
        onClick={() => onWeekChange(addWeeks(currentWeekStart, 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 transition-colors text-on-surface-variant"
        aria-label="Nächste Woche"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
