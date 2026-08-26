import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { JsonLdContactPage, JsonLdBreadcrumbs } from '@/components/seo/JsonLd'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  const title = isSpanish
    ? 'Contacto | Hablemos de Tu Caso'
    : 'Contact | Let\'s Talk About Your Case'
  const description = isSpanish
    ? 'Escríbenos o llámanos al 968 241 025. Te escuchamos, analizamos tu situación y te orientamos con honestidad. Estamos en Murcia, Plaza Fuensanta 3.'
    : 'Write to us or call 968 241 025. We listen, analyze your situation and guide you honestly. Located in Murcia, Plaza Fuensanta 3.'
  
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/contacto`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/contacto`,
      siteName: siteConfig.name,
      type: 'website',
      locale: isSpanish ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ContactoPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  // Mailto con asunto predefinido
  const mailtoSubject = isSpanish 
    ? 'Solicitud de información legal - Negligencia médica'
    : 'Legal information request - Medical negligence'
  const mailtoHref = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(mailtoSubject)}`
  
  return (
    <>
      <JsonLdContactPage />
      <JsonLdBreadcrumbs
        items={[
          { name: isSpanish ? 'Inicio' : 'Home', url: siteConfig.url },
          { name: isSpanish ? 'Contacto' : 'Contact', url: `${siteConfig.url}/${locale}/contacto` },
        ]}
      />

      {/* Hero */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Contacto' : 'Contact' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            <span className="text-gold">{isSpanish ? 'Contacta' : 'Contact'}</span>{' '}
            {isSpanish ? 'con Nosotros' : 'Us'}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {isSpanish
              ? 'Estamos aquí para ayudarte. Llámanos o escríbenos y te atenderemos de forma personalizada.'
              : 'We are here to help you. Call us or write to us and we will assist you personally.'}
          </p>
        </div>
      </section>

      {/* Contact Section - Info izquierda, Mapa derecha */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info - Izquierda */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
                {isSpanish ? 'Información de Contacto' : 'Contact Information'}
              </h2>

              <div className="space-y-8">
                {/* Phone */}
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-start gap-4 group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                    <Phone className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      {isSpanish ? 'Llámanos' : 'Call us'}
                    </span>
                    <span className="block text-2xl font-bold text-charcoal group-hover:text-gold transition-colors">
                      {siteConfig.contact.phone}
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      {isSpanish ? 'Te escuchamos' : 'We listen to you'}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={mailtoHref}
                  className="flex items-start gap-4 group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                    <Mail className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      {isSpanish ? 'Escríbenos' : 'Write to us'}
                    </span>
                    <span className="block text-xl font-bold text-charcoal group-hover:text-gold transition-colors">
                      {siteConfig.contact.email}
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      {isSpanish ? 'Te respondemos en 24h' : 'We respond within 24h'}
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      {isSpanish ? 'Visítanos' : 'Visit us'}
                    </span>
                    <span className="block text-lg font-bold text-charcoal">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">
                      {isSpanish ? 'Horario de atención' : 'Office hours'}
                    </span>
                    <span className="block text-lg font-bold text-charcoal">
                      {siteConfig.contact.schedule}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa - Derecha */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
                {isSpanish ? 'Nuestra Ubicación' : 'Our Location'}
              </h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.8!2d-1.1307!3d37.9838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6381f8d5c8c7c1%3A0x1234567890abcdef!2sPlaza%20Fuensanta%2C%203%2C%2030008%20Murcia!5e0!3m2!1ses!2ses!4v1701500000000!5m2!1ses!2ses"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isSpanish ? 'Ubicación GVC Expertos - Murcia' : 'GVC Expertos Location - Murcia'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
              {isSpanish ? '¿Tienes dudas?' : 'Have questions?'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isSpanish ? (
                <>
                  Consulta nuestra sección de{' '}
                  <a href={`/${locale}/preguntas-frecuentes`} className="text-gold hover:underline">
                    preguntas frecuentes
                  </a>{' '}
                  o llámanos directamente. Estamos aquí para ayudarte.
                </>
              ) : (
                <>
                  Check our{' '}
                  <a href={`/${locale}/preguntas-frecuentes`} className="text-gold hover:underline">
                    FAQ section
                  </a>{' '}
                  or call us directly. We are here to help you.
                </>
              )}
            </p>
            <p className="text-gray-500 text-sm">
              {isSpanish
                ? 'Tu consulta será tratada con total confidencialidad.'
                : 'Your consultation will be treated with complete confidentiality.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}



