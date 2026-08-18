"use client"

import { useState, useEffect, useCallback } from 'react'
import { getShareCodes, createShareCode, validateShareCode } from '@/lib/lessons'
import { generateShareCode } from '@/lib/utils'
import { getUser } from '@/lib/auth'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Plus, Share2, ArrowLeft, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function TeilenPage() {
  const [shareCodes, setShareCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [activeCode, setActiveCode] = useState<string>('')
  const [baseUrl, setBaseUrl] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const [user, codes] = await Promise.all([
      getUser(),
      getShareCodes(),
    ])
    setIsAdmin(!!user)
    setShareCodes(codes)
    if (codes.length > 0) setActiveCode(codes[0].code)
    setLoading(false)
  }, [])

  useEffect(() => {
    setBaseUrl(window.location.origin)
    loadData()
  }, [loadData])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleGenerateCode = async () => {
    setGenerating(true)
    const code = generateShareCode()
    const result = await createShareCode(code, 'Freigabe-Link')
    if (result) {
      await loadData()
      setActiveCode(code)
    }
    setGenerating(false)
  }

  const shareUrl = activeCode ? `${baseUrl}/ansicht/${activeCode}` : ''

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 bg-surface/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-gray-800 text-on-surface-variant transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg text-primary dark:text-gray-100">Teilen</h1>
        </div>
        <Share2 size={20} className="text-on-surface-variant" />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-gray-100">Stundenplan teilen</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Teile deinen Stundenplan mit Freunden. Sie erhalten nur Leserechte.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* QR Code Card */}
            {activeCode ? (
              <div className="bg-surface-container-lowest dark:bg-gray-900 rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
                <h3 className="font-semibold text-base text-on-surface dark:text-gray-100 mb-1">QR-Code</h3>
                <p className="text-sm text-on-surface-variant mb-5">
                  Scanne den Code, um den Stundenplan direkt zu öffnen.
                </p>

                {/* QR Code */}
                <div className="flex justify-center mb-5">
                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <QRCodeSVG
                      value={shareUrl}
                      size={180}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* URL */}
                <div className="bg-surface-container-low dark:bg-gray-800 rounded-xl border border-outline-variant/30 p-3 flex items-center gap-2">
                  <p className="flex-1 text-xs text-on-surface-variant font-mono truncate">{shareUrl}</p>
                  <button
                    onClick={() => handleCopy(shareUrl)}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    {copiedCode === shareUrl ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode === shareUrl ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest dark:bg-gray-900 rounded-2xl border border-outline-variant/30 p-6 text-center">
                <Share2 size={40} className="text-on-surface-variant mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant">
                  Noch kein Freigabe-Code vorhanden.
                </p>
              </div>
            )}

            {/* Invitation Code Card */}
            <div className="bg-surface-container-lowest dark:bg-gray-900 rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
              <h3 className="font-semibold text-base text-on-surface dark:text-gray-100 mb-1">Einladungscode</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Teile diesen Code, damit andere deinen Stundenplan aufrufen können.
              </p>

              {shareCodes.length > 0 ? (
                <div className="space-y-3">
                  {shareCodes.map(sc => (
                    <div
                      key={sc.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                        activeCode === sc.code
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant/30 hover:bg-surface-container dark:hover:bg-gray-800"
                      )}
                      onClick={() => setActiveCode(sc.code)}
                    >
                      <div className="flex-1">
                        <p className="font-mono font-bold text-sm text-on-surface dark:text-gray-100">{sc.code}</p>
                        {sc.label && (
                          <p className="text-xs text-on-surface-variant mt-0.5">{sc.label}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(sc.code) }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-gray-700 text-on-surface-variant transition-colors"
                      >
                        {copiedCode === sc.code ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  Noch kein Code vorhanden.
                </p>
              )}

              {/* Generate new code (admin only) */}
              {isAdmin && (
                <button
                  onClick={handleGenerateCode}
                  disabled={generating}
                  className="w-full mt-4 py-2.5 rounded-xl border border-outline-variant text-on-surface dark:text-gray-100 text-sm font-semibold hover:bg-surface-container dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <div className="w-4 h-4 border-2 border-on-surface border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={16} />
                      Neuen Code generieren
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Code Entry for guests */}
            {!isAdmin && (
              <CodeEntry baseUrl={baseUrl} />
            )}

            {/* Info */}
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
              <p className="text-xs text-secondary font-medium mb-1">Hinweis</p>
              <p className="text-xs text-on-surface-variant">
                Personen mit dem Link oder Code können deinen Stundenplan nur lesen. 
                Sie können keine Änderungen vornehmen.
              </p>
            </div>
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-outline-variant/30 flex items-center justify-around px-4 z-40">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <CalendarDays size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Stundenplan</span>
        </Link>
        <div className="flex flex-col items-center gap-0.5 text-secondary">
          <Share2 size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Teilen</span>
        </div>
        <Link href="/admin" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <CalendarDays size={22} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Admin</span>
        </Link>
      </nav>
    </div>
  )
}

function CodeEntry({ baseUrl }: { baseUrl: string }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    const isValid = await validateShareCode(code.trim().toUpperCase())
    if (isValid) {
      window.location.href = `/ansicht/${code.trim().toUpperCase()}`
    } else {
      setError('Ungültiger oder abgelaufener Code.')
      setChecking(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest dark:bg-gray-900 rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
      <h3 className="font-semibold text-base text-on-surface dark:text-gray-100 mb-1">Code eingeben</h3>
      <p className="text-sm text-on-surface-variant mb-4">
        Hast du einen Einladungscode erhalten? Gib ihn hier ein.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="SP-XXXX-XXXX"
          className="flex-1 bg-surface-container-low dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-on-surface dark:text-gray-100 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors uppercase"
        />
        <button
          type="submit"
          disabled={checking || !code.trim()}
          className="px-4 py-2.5 bg-secondary text-on-secondary rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {checking ? '…' : 'Öffnen'}
        </button>
      </form>
      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  )
}
