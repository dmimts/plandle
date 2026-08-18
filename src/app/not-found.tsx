import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarDays size={32} className="text-secondary" />
        </div>
        <h1 className="text-4xl font-bold text-primary dark:text-gray-100 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-on-surface dark:text-gray-200 mb-2">Seite nicht gefunden</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Diese Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors"
        >
          <CalendarDays size={16} />
          Zum Stundenplan
        </Link>
      </div>
    </div>
  )
}
