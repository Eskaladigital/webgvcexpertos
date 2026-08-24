import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/ui/BackToTop'
import { CookieBanner } from '@/components/ui/CookieBanner'
// import { Toaster } from '@/components/ui/toaster' // Comentado temporalmente si no existe
import { siteConfig } from '@/config/site'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isSpanish = locale === 'es'
  
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: isSpanish ? siteConfig.name : 'Medical Negligence Lawyers',
      template: isSpanish ? `%s | ${siteConfig.name}` : `%s | ${siteConfig.name}`,
    },
    description: isSpanish 
      ? siteConfig.description
      : 'Multidisciplinary law firm since 1946, specialized in medical negligence. Rigor, closeness and honesty in patient defense.',
    keywords: isSpanish
      ? [
          'abogados negligencias médicas',
          'errores médicos',
          'mala praxis médica',
          'defensa del paciente',
          'derecho sanitario',
        ]
      : [
          'medical negligence lawyers',
          'medical errors',
          'medical malpractice',
          'patient defense',
          'health law',
        ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es-ES': '/es',
        'en-US': '/en',
      },
    },
    icons: {
      icon: '/images/favicon.png',
      apple: '/images/favicon.png',
      shortcut: '/images/favicon.png',
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: isSpanish ? siteConfig.name : 'Medical Negligence Lawyers',
      description: isSpanish
        ? siteConfig.description
        : 'Specialized lawyers in medical negligence and medical errors.',
      images: [{
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isSpanish ? siteConfig.name : 'Medical Negligence Lawyers',
      description: isSpanish
        ? siteConfig.description
        : 'Specialized lawyers in medical negligence.',
      images: [`${siteConfig.url}/images/og-image.jpg`],
      creator: '@gvc_abogados',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: '/manifest.json',
  }
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages({ locale })

  return (
    <div className={`${inter.variable} ${playfair.variable} min-h-screen bg-white antialiased flex flex-col`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <BackToTop />
      </NextIntlClientProvider>
    </div>
  )
}
