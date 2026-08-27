import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { siteConfig } from '@/config/site'
import { CookieSettingsButton } from '@/components/ui/CookieBanner'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  return {
    title: isSpanish ? 'Política de Cookies' : 'Cookie Policy',
    description: isSpanish
      ? 'Política de cookies del sitio web de GVC Expertos.'
      : 'Cookie policy of the GVC Expertos website.',
    alternates: {
      canonical: `/${locale}/politica-cookies`,
    },
  }
}

export default async function PoliticaCookiesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  return (
    <>
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Política de Cookies' : 'Cookie Policy' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            {isSpanish ? (
              <>
                Política de <span className="text-gold">Cookies</span>
              </>
            ) : (
              <>
                Cookie <span className="text-gold">Policy</span>
              </>
            )}
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {isSpanish ? (
              <>
                <h2>¿Qué son las cookies?</h2>
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web
                  almacenan en tu dispositivo cuando los visitas. Se utilizan
                  ampliamente para hacer que los sitios web funcionen de manera más
                  eficiente y proporcionar información a los propietarios del sitio.
                </p>

                <h2>Tipos de cookies que utilizamos</h2>

                <h3>Cookies técnicas (necesarias)</h3>
                <p>
                  Son esenciales para el funcionamiento del sitio web. Permiten
                  navegar por la página y utilizar sus funciones básicas.
                </p>

                <h3>Cookies analíticas</h3>
                <p>
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio
                  web, recopilando información de forma anónima. Utilizamos Google
                  Analytics para este fin.
                </p>

                <h3>Cookies de preferencias</h3>
                <p>
                  Permiten recordar tus preferencias (como el idioma o la región) y
                  proporcionar funciones mejoradas y más personalizadas.
                </p>

                <h2>Cookies de terceros</h2>
                <p>Este sitio web puede utilizar cookies de terceros:</p>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> Para analizar el tráfico del
                    sitio web
                  </li>
                  <li>
                    <strong>Google Maps:</strong> Si mostramos mapas de ubicación
                  </li>
                </ul>

                <h2>Gestión de cookies</h2>
                <p>
                  Puedes modificar tu consentimiento en cualquier momento desde el pie
                  de página o con este botón:
                </p>
                <p>
                  <CookieSettingsButton className="inline-flex items-center px-5 py-3 rounded-lg bg-gold text-white text-sm font-semibold hover:bg-gold-dark" />
                </p>
                <p>
                  Puedes gestionar las cookies a través de la configuración de tu
                  navegador. A continuación, te indicamos cómo hacerlo en los
                  navegadores más comunes:
                </p>
                <ul>
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>

                <h2>Actualización de la política</h2>
                <p>
                  Esta política de cookies puede ser actualizada periódicamente para
                  reflejar cambios en las cookies que utilizamos o por otras razones
                  operativas, legales o regulatorias.
                </p>

                <h2>Contacto</h2>
                <p>
                  Si tienes alguna pregunta sobre nuestra política de cookies, puedes
                  contactarnos en{' '}
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                </p>

                <p className="text-sm text-gray-500 mt-8">
                  Última actualización: Diciembre 2024
                </p>
              </>
            ) : (
              <>
                <h2>What are cookies?</h2>
                <p>
                  Cookies are small text files that websites store on your device when
                  you visit them. They are widely used to make websites work more
                  efficiently and provide information to site owners.
                </p>

                <h2>Types of cookies we use</h2>

                <h3>Technical cookies (necessary)</h3>
                <p>
                  They are essential for the website to function. They allow you to
                  navigate the page and use its basic functions.
                </p>

                <h3>Analytics cookies</h3>
                <p>
                  They help us understand how visitors interact with the website,
                  collecting information anonymously. We use Google Analytics for this
                  purpose.
                </p>

                <h3>Preference cookies</h3>
                <p>
                  They allow us to remember your preferences (such as language or
                  region) and provide enhanced and more personalized features.
                </p>

                <h2>Third-party cookies</h2>
                <p>This website may use third-party cookies:</p>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> To analyze website traffic
                  </li>
                  <li>
                    <strong>Google Maps:</strong> If we show location maps
                  </li>
                </ul>

                <h2>Cookie management</h2>
                <p>
                  You can change your consent at any time from the footer or with this
                  button:
                </p>
                <p>
                  <CookieSettingsButton className="inline-flex items-center px-5 py-3 rounded-lg bg-gold text-white text-sm font-semibold hover:bg-gold-dark" />
                </p>
                <p>
                  You can manage cookies through your browser settings. Below, we
                  explain how to do it in the most common browsers:
                </p>
                <ul>
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>

                <h2>Policy update</h2>
                <p>
                  This cookie policy may be updated periodically to reflect changes in
                  the cookies we use or for other operational, legal or regulatory
                  reasons.
                </p>

                <h2>Contact</h2>
                <p>
                  If you have any questions about our cookie policy, you can contact
                  us at{' '}
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                </p>

                <p className="text-sm text-gray-500 mt-8">
                  Last update: December 2024
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
