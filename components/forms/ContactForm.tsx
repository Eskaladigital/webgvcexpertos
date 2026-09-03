'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useLocale, useTranslations } from 'next-intl'
import { LocalizedLink } from '@/components/ui/LocalizedLink'

interface ContactFormProps {
  services: { slug: string; title: string }[]
}

export function ContactForm({ services }: ContactFormProps) {
  const t = useTranslations('contact.form')
  const tServices = useTranslations('services')
  const locale = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [contactType, setContactType] = useState('particular')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formStartedAt, setFormStartedAt] = useState(0)

  useEffect(() => {
    setFormStartedAt(Date.now())
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
      privacy: formData.get('privacy') === 'on',
      contact_type: (formData.get('contact_type') as string) || 'particular',
      company: formData.get('company') as string,
      referral_source: formData.get('referral_source') as string,
      locale,
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    const newErrors: Record<string, string> = {}
    if (!data.name) newErrors.name = t('nameRequired')
    if (!data.email) newErrors.email = t('emailRequired')
    if (!data.phone) newErrors.phone = t('phoneRequired')
    if (!data.message) newErrors.message = t('messageRequired')
    if (!data.privacy) newErrors.privacy = t('privacyRequired')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          gdpr_consent: data.privacy,
          website: formData.get('website') as string,
          form_started_at: formStartedAt,
        }),
      })
      if (!res.ok) {
        setErrors({ submit: t('error') })
        return
      }
      setIsSuccess(true)
    } catch {
      setErrors({ submit: t('error') })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">
          {t('successTitle')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('successMessage')}
        </p>
        <Button variant="outline" onClick={() => { setIsSuccess(false); setContactType('particular') }}>
          {t('sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Select
        name="contact_type"
        label={t('contactType')}
        defaultValue="particular"
        onChange={(e) => setContactType(e.target.value)}
        options={[
          { value: 'particular', label: t('particular') },
          { value: 'professional', label: t('professional') },
        ]}
      />

      {contactType === 'professional' && (
        <Input
          name="company"
          label={t('company')}
          placeholder={t('companyPlaceholder')}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          label={`${t('name')} *`}
          placeholder={t('namePlaceholder')}
          error={errors.name}
        />
        <Input
          name="email"
          type="email"
          label={`${t('email')} *`}
          placeholder={t('emailPlaceholder')}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="phone"
          type="tel"
          label={`${t('phone')} *`}
          placeholder={t('phonePlaceholder')}
          error={errors.phone}
        />
        <Select
          name="service"
          label={t('service')}
          placeholder={t('selectService')}
          options={[
            { value: '', label: t('selectService') },
            ...services.map((s) => {
              const serviceSlugMap: Record<string, string> = {
                'errores-quirurgicos': 'surgical-errors',
                'errores-diagnostico': 'diagnostic-errors',
                'negligencia-hospitalaria': 'hospital-negligence',
                'negligencia-obstetrica': 'obstetric-negligence',
                'errores-medicacion': 'medication-errors',
                'consentimiento-informado': 'informed-consent',
              }
              const translationKey = serviceSlugMap[s.slug] || s.slug
              return { value: s.slug, label: tServices(`${translationKey}.title`) }
            }),
            { value: 'otro', label: t('otherService') },
          ]}
        />
      </div>

      <Select
        name="referral_source"
        label={t('referral')}
        placeholder={t('referralPlaceholder')}
        options={[
          { value: '', label: t('referralPlaceholder') },
          { value: 'google', label: t('referralGoogle') },
          { value: 'social', label: t('referralSocial') },
          { value: 'referral', label: t('referralKnown') },
          { value: 'other', label: t('referralOther') },
        ]}
      />

      <Textarea
        name="message"
        label={`${t('message')} *`}
        placeholder={t('messagePlaceholder')}
        rows={5}
        error={errors.message}
      />

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          className="mt-1 w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
        />
        <label htmlFor="privacy" className="text-sm text-gray-600">
          {t('privacyText')}{' '}
          <LocalizedLink href="/politica-privacidad" className="text-gold hover:underline">
            {t('privacyLink')}
          </LocalizedLink>{' '}
          {t('privacyAnd')} *
        </label>
      </div>
      {errors.privacy && (
        <p className="text-sm text-red-500 -mt-4">{errors.privacy}</p>
      )}

      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('sending')}
          </>
        ) : (
          t('submit')
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        {t('dataProtected')}
      </p>
    </form>
  )
}
