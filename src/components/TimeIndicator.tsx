"use client"

import { useEffect, useState } from 'react'

interface TimeIndicatorProps {
  startHour: number // first hour shown in grid
  pixelsPerHour: number
}

export function TimeIndicator({ startHour, pixelsPerHour }: TimeIndicatorProps) {
  const [position, setPosition] = useState<number | null>(null)
  const [timeLabel, setTimeLabel] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const totalMinutes = hours * 60 + minutes
      const startMinutes = startHour * 60
      const endMinutes = 18 * 60 // Cap at 18:00
      const offsetMinutes = totalMinutes - startMinutes
      if (offsetMinutes >= 0 && totalMinutes <= endMinutes) {
        setPosition((offsetMinutes / 60) * pixelsPerHour)
        setTimeLabel(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
      } else {
        setPosition(null)
      }
    }
    update()
    const interval = setInterval(update, 60000) // update every minute
    return () => clearInterval(interval)
  }, [startHour, pixelsPerHour])

  if (position === null) return null

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
      style={{ top: `${position}px` }}
    >
      {/* Time label */}
      <div className="absolute left-0 -translate-y-1/2 bg-error text-on-error text-[10px] font-mono px-1.5 py-0.5 rounded shadow-md z-30 whitespace-nowrap">
        {timeLabel}
      </div>
      {/* Dot */}
      <div className="w-2 h-2 rounded-full bg-error ml-14 -translate-y-1/2 flex-shrink-0 shadow-sm" />
      {/* Line */}
      <div className="flex-1 h-[1.5px] bg-error shadow-[0_0_6px_rgba(186,26,26,0.5)]" />
    </div>
  )
}
