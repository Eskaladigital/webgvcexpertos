import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Scale, FileCheck, Clock } from 'lucide-react'
import { services } from '@/config/site'
import { ServiceIcon } from '@/components/ui/Icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaFinal } from '@/components/home'
import { JsonLdBreadcrumbs } from '@/components/seo/JsonLd'
import { siteConfig } from '@/config/site'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  return {
    title: isSpanish
      ? 'Negligencias Médicas | Tipos de Errores Médicos'
      : 'Medical Negligence | Types of Medical Errors',
    description: isSpanish
      ? 'Abogados especializados en negligencias médicas: errores quirúrgicos, diagnósticos incorrectos, negligencia hospitalaria, obstétrica y más. Bufete desde 1946.'
      : 'Lawyers specialized in medical negligence: surgical errors, incorrect diagnoses, hospital negligence, obstetric and more. Law firm since 1946.',
    alternates: {
      canonical: `${siteConfig.url}/${locale}/negligencias-medicas`,
      languages: {
        'es-ES': `${siteConfig.url}/es/negligencias-medicas`,
        'en-US': `${siteConfig.url}/en/negligencias-medicas`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: `${siteConfig.url}/${locale}/negligencias-medicas`,
      title: isSpanish
        ? 'Negligencias Médicas | Tipos de Errores Médicos'
        : 'Medical Negligence | Types of Medical Errors',
      description: isSpanish
        ? 'Especialistas en todo tipo de negligencias médicas'
        : 'Specialists in all types of medical negligence',
      siteName: siteConfig.name,
    },
  }
}

export default async function NegligenciasMedicasPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  const tServices = await getTranslations({ locale, namespace: 'services' })
  
  // Mapeo de slugs español a inglés para traducciones
  const serviceSlugMap: Record<string, string> = {
    'errores-quirurgicos': 'surgical-errors',
    'errores-diagnostico': 'diagnostic-errors',
    'negligencia-hospitalaria': 'hospital-negligence',
    'negligencia-obstetrica': 'obstetric-negligence',
    'errores-medicacion': 'medication-errors',
    'consentimiento-informado': 'informed-consent',
  }
  
  return (
    <>
      <JsonLdBreadcrumbs
        items={[
          { name: isSpanish ? 'Inicio' : 'Home', url: siteConfig.url },
          { 
            name: isSpanish ? 'Negligencias Médicas' : 'Medical Negligence', 
            url: `${siteConfig.url}/${locale}/negligencias-medicas` 
          },
        ]}
      />

      {/* Hero */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Negligencias Médicas' : 'Medical Negligence' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            {isSpanish ? (
              <>
                Tipos de <span className="text-gold">Negligencias Médicas</span>
              </>
            ) : (
              <>
                Types of <span className="text-gold">Medical Negligence</span>
              </>
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {isSpanish
              ? 'Estamos especializados en la defensa de víctimas de todo tipo de negligencias y errores médicos. Conoce las diferentes áreas en las que podemos ayudarte.'
              : 'We specialize in defending victims of all types of medical negligence and errors. Learn about the different areas where we can help you.'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const translationKey = serviceSlugMap[service.slug] || service.slug
              return (
                <Link
                  key={service.slug}
                  href={`/${locale}/negligencias-medicas/${service.slug}`}
                  className="bg-white p-8 rounded-sm shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="text-gold mb-4">
                    <ServiceIcon name={service.icon} className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-3 group-hover:text-gold transition-colors">
                    {tServices(`${translationKey}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tServices(`${translationKey}.description`)}
                  </p>
                  <span className="inline-flex items-center text-gold font-semibold text-sm group-hover:gap-2 transition-all">
                    {isSpanish ? 'Saber más' : 'Learn more'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/abogados_negligencias_medicas_negligencia_2.jpg"
                alt={isSpanish ? 'Abogados especialistas' : 'Specialist lawyers'}
                width={600}
                height={400}
                className="rounded-sm"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
                {isSpanish
                  ? '¿Qué es una Negligencia Médica?'
                  : 'What is Medical Negligence?'}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {isSpanish
                  ? 'Una negligencia médica ocurre cuando un profesional sanitario no actúa con la diligencia debida, causando daños al paciente. Esto puede incluir errores en el diagnóstico, tratamiento, cirugía o atención general.'
                  : 'Medical negligence occurs when a healthcare professional does not act with due diligence, causing harm to the patient. This can include errors in diagnosis, treatment, surgery or general care.'}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Shield className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-charcoal mb-2">
                    {isSpanish ? 'Trayectoria' : 'Track Record'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isSpanish ? 'Desde 1946' : 'Since 1946'}
                  </p>
                </div>
                <div>
                  <Scale className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-charcoal mb-2">
                    {isSpanish ? 'Nobleza' : 'Nobility'}
                  </h3>
                  <p className="text-sm text-gray-600">{isSpanish ? 'En el servicio' : 'In service'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}

