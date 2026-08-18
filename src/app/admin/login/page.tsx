"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { CalendarDays, LogIn, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await signIn(email, password)
    if (authError) {
      console.error('Auth error:', authError)
      setError('Ungültige E-Mail-Adresse oder falsches Passwort.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <CalendarDays size={28} className="text-on-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-gray-100">Stundenplan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Admin-Bereich</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest dark:bg-gray-900 rounded-2xl border border-outline-variant/30 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-on-surface dark:text-gray-100 mb-1">Anmelden</h2>
          <p className="text-sm text-on-surface-variant mb-6">Melde dich mit deinem Admin-Konto an.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5" htmlFor="email">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@beispiel.de"
                required
                className="w-full bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5" htmlFor="password">
                Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl px-4 py-3 pr-12 text-sm text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-container/30 border border-error/30 rounded-xl px-4 py-3">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary dark:bg-secondary text-on-primary py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Anmelden
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          <a href="/" className="hover:text-secondary transition-colors">← Zurück zum Stundenplan</a>
        </p>
      </div>
    </div>
  )
}
