// Layout raíz REQUERIDO por Next.js App Router
// DEBE tener <html> y <body>
import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
    shortcut: '/images/favicon.png',
  },
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        {GA_ID ? (
          <Script
            id="gtag-consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              var granted = false;
              try { granted = localStorage.getItem('cookie_consent') === 'accepted'; } catch (e) {}
              var v = granted ? 'granted' : 'denied';
              gtag('consent', 'default', {
                analytics_storage: v,
                ad_storage: v,
                ad_user_data: v,
                ad_personalization: v,
                wait_for_update: 500
              });
            `,
            }}
          />
        ) : null}
      </head>
      <body>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
        {children}
      </body>
    </html>
  )
}
