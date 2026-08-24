// Layout raíz REQUERIDO por Next.js App Router
// DEBE tener <html> y <body>
import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-D23DZMB7SG'

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
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}

