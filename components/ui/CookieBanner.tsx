'use client'

import { useCallback, useEffect, useState } from 'react'
import { Cookie, X, ShieldCheck, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LocalizedLink } from './LocalizedLink'

export const OPEN_COOKIE_SETTINGS = 'openCookieSettings'
const KEY = 'cookie_consent'
const PREFS_KEY = 'cookie_preferences'

type Prefs = {
  necessary: true
  analytics: boolean
}

const ALL_ON: Prefs = { necessary: true, analytics: true }
const ONLY_NECESSARY: Prefs = { necessary: true, analytics: false }

function updateGtag(prefs: Prefs) {
  if (typeof window === 'undefined' || !(window as any).gtag) return
  const v = prefs.analytics ? 'granted' : 'denied'
  ;(window as any).gtag('consent', 'update', {
    analytics_storage: v,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

function persist(prefs: Prefs) {
  localStorage.setItem(KEY, prefs.analytics ? 'accepted' : 'rejected')
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  updateGtag(prefs)
}

function readPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Prefs>
      return { necessary: true, analytics: Boolean(parsed.analytics) }
    }
    const legacy = localStorage.getItem(KEY)
    if (legacy === 'accepted') return ALL_ON
    if (legacy === 'rejected') return ONLY_NECESSARY
  } catch {
    /* modo privado */
  }
  return null
}

export function openCookieSettings() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))
}

export function CookieSettingsButton({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  const t = useTranslations('cookie')
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label ?? t('configureFooter')}
    </button>
  )
}

export function CookieBanner() {
  const t = useTranslations('cookie')
  const [view, setView] = useState<'hidden' | 'banner' | 'settings'>('hidden')
  const [prefs, setPrefs] = useState<Prefs>(ALL_ON)

  useEffect(() => {
    const stored = readPrefs()
    if (stored) {
      setPrefs(stored)
      updateGtag(stored)
    } else {
      setView('banner')
    }
    const open = () => {
      const current = readPrefs()
      if (current) setPrefs(current)
      setView('settings')
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS, open)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open)
  }, [])

  const acceptAll = useCallback(() => {
    persist(ALL_ON)
    setPrefs(ALL_ON)
    setView('hidden')
  }, [])

  const rejectAll = useCallback(() => {
    persist(ONLY_NECESSARY)
    setPrefs(ONLY_NECESSARY)
    setView('hidden')
  }, [])

  const save = useCallback(() => {
    persist(prefs)
    setView('hidden')
  }, [prefs])

  if (view === 'hidden') return null

  if (view === 'settings') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8 text-gold" aria-hidden="true" />
              <h2 id="cookie-settings-title" className="text-xl font-serif font-bold text-charcoal">{t('settingsTitle')}</h2>
            </div>
            <button type="button" onClick={() => setView(readPrefs() ? 'hidden' : 'banner')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" aria-label={t('close')}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-gray-600 mb-6">{t('settingsIntro')}</p>
            <div className="p-4 rounded-xl border-2 mb-4 border-gold bg-gold/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gold text-white shrink-0">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-charcoal">{t('necessary')}</h3>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{t('alwaysOn')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('necessaryDesc')}</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border-2 mb-4 ${prefs.analytics ? 'border-gold bg-gold/5' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${prefs.analytics ? 'bg-gold text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-charcoal">{t('analytics')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={prefs.analytics} onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} aria-label={t('analytics')} />
                      <span className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-gold transition-colors" />
                      <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">{t('analyticsDesc')}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              {t('moreInfoPrefix')}{' '}
              <LocalizedLink href="/politica-cookies" className="text-gold hover:underline" onClick={() => setView('hidden')}>
                {t('moreInfo')}
              </LocalizedLink>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button type="button" onClick={rejectAll} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white">{t('rejectAll')}</button>
            <button type="button" onClick={save} className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700">{t('save')}</button>
            <button type="button" onClick={acceptAll} className="flex-1 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg font-semibold">{t('acceptAll')}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg md:p-6" role="region" aria-label={t('bannerLabel')}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-8 h-8 text-gold flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-serif font-bold text-charcoal mb-1">{t('title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('message')}{' '}
                <LocalizedLink href="/politica-cookies" className="text-gold hover:underline">
                  {t('moreInfo')}
                </LocalizedLink>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
            <button type="button" onClick={() => setView('settings')} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">
              {t('configure')}
            </button>
            <button type="button" onClick={acceptAll} className="px-4 py-2 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-lg">
              {t('acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
