'use client'

import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LocalizedLink } from './LocalizedLink'

export function CookieBanner() {
  const t = useTranslations('cookie')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar si ya aceptó las cookies
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Mostrar después de 1 segundo
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const updateGtag = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const value = granted ? 'granted' : 'denied'
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
      })
    }
  }

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    updateGtag(true)
    setIsVisible(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    updateGtag(false)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-charcoal border-t border-white/10 shadow-lg animate-slide-up">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm">
                {t('message')}{' '}
                <LocalizedLink href="/politica-cookies" className="text-gold hover:underline">
                  {t('moreInfo')}
                </LocalizedLink>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={rejectCookies}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('reject')}
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded transition-colors"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
