'use client'

import Image from 'next/image'
import { Phone, Mail, MapPin, Twitter, Facebook } from 'lucide-react'
import { siteConfig, services } from '@/config/site'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { useTranslations, useLocale } from 'next-intl'
import { getTranslatedRoute, getTranslatedServiceRoute, routes } from '@/lib/routes'
import { getLocalizedPath } from '@/lib/i18n-utils'
import { CookieSettingsButton } from '@/components/ui/CookieBanner'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const locale = useLocale() as 'es' | 'en'
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tContact = useTranslations('contact.info')
  const tServices = useTranslations('services')
  const tLegal = useTranslations('footer')
  
  // Generar links del footer con rutas traducidas
  const footerServices = services.map((service) => {
    const serviceSlugMap: Record<string, string> = {
      'errores-quirurgicos': 'surgical-errors',
      'errores-diagnostico': 'diagnostic-errors',
      'negligencia-hospitalaria': 'hospital-negligence',
      'negligencia-obstetrica': 'obstetric-negligence',
      'errores-medicacion': 'medication-errors',
      'consentimiento-informado': 'informed-consent',
    }
    // Las traducciones siempre usan las claves en inglés
    const translationKey = serviceSlugMap[service.slug] || service.slug
    return {
      label: tServices(`${translationKey}.title`),
      href: getTranslatedServiceRoute(service.slug, locale),
    }
  })
  
  const footerCompany = [
    { label: tNav('about'), href: getTranslatedRoute('about', locale) },
    { label: tNav('team'), href: getTranslatedRoute('team', locale) },
    { label: tNav('blog'), href: getTranslatedRoute('blog', locale) },
    { label: tNav('contact'), href: getTranslatedRoute('contact', locale) },
    { label: tNav('faq'), href: getTranslatedRoute('faq', locale) },
  ]
  
  const footerLegal = [
    { label: tLegal('legalNotice'), href: routes[locale].legal.notice },
    { label: tLegal('privacy'), href: routes[locale].legal.privacy },
    { label: tLegal('cookies'), href: routes[locale].legal.cookies },
  ]

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <LocalizedLink href="/" className="inline-block mb-6">
              <Image
                src="/images/gvcabogados_murcia_logo_leon_blanco.png"
                alt={siteConfig.name}
                width={160}
                height={45}
                className="h-11 w-auto"
              />
            </LocalizedLink>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('description')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-5 text-gold">
              {t('services')}
            </h4>
            <ul className="space-y-3">
              {footerServices.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-5 text-gold">
              {tNav('about')}
            </h4>
            <ul className="space-y-3">
              {footerCompany.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-5 text-gold">
              {tNav('contact')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white group-hover:text-gold transition-colors">
                      {siteConfig.contact.phone}
                    </span>
                    <span className="text-xs">{tContact('freeCall')}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.address}</span>
                </div>
              </li>
              <li>
                <p className="text-gray-400 text-sm pl-8">
                  {siteConfig.contact.schedule}
                </p>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-5 text-gold">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLegal.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="text-gray-400 hover:text-white text-sm transition-colors bg-transparent p-0 border-0 cursor-pointer" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} {siteConfig.legal.company}. {t('copyright')}.
            </p>
            <LocalizedLink
              href={routes[locale].legal.sitemap}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              {tLegal('sitemap')}
            </LocalizedLink>
          </div>
          <p className="mt-4 text-center text-gray-500 text-xs leading-relaxed">
            <span className="block sm:inline">Hecho con <span className="text-red-500 inline-block animate-pulse">❤️</span> en Murcia</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Web desarrollada por{' '}
              <a href="https://www.eskaladigital.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white font-medium whitespace-nowrap">
                ESKALA Agencia de Marketing Digital
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
