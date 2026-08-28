import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Phone, 
  ArrowRight, 
  MapPin, 
  CheckCircle, 
  Star, 
  Building2,
  Clock,
  Shield,
  Award,
  Users,
  FileCheck,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import { cities, services, siteConfig } from '@/config/site'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ServiceIcon } from '@/components/ui/Icons'
import { CtaFinal } from '@/components/home'
import { JsonLdLocalBusinessCity, JsonLdBreadcrumbs, JsonLdFAQ } from '@/components/seo/JsonLd'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getTranslations } from 'next-intl/server'

// Generar rutas estáticas para todas las ciudades y locales
export function generateStaticParams() {
  const params: { locale: string; ciudad: string }[] = []
  cities.forEach((city) => {
    params.push({ locale: 'es', ciudad: city.slug })
    params.push({ locale: 'en', ciudad: city.slug })
  })
  return params
}

// Generar metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; ciudad: string }>
}): Promise<Metadata> {
  const { locale, ciudad } = await params
  const city = cities.find((c) => c.slug === ciudad)

  if (!city) {
    return { title: 'Página no encontrada' }
  }

  const isSpanish = locale === 'es'
  const title = isSpanish
    ? `Negligencias médicas en ${city.name} | GVC Expertos (Murcia)`
    : `Medical negligence in ${city.name} | GVC Expertos (Murcia)`
  const description = isSpanish
    ? `El daño ocurrió en ${city.name}. El despacho está en Murcia y llevamos el caso en todo el territorio. ☎ ${siteConfig.contact.phone}`
    : `The harm occurred in ${city.name}. The firm is in Murcia and we handle the case nationwide. ☎ ${siteConfig.contact.phone}`
  const url = `${siteConfig.url}/${locale}/${city.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        'es-ES': `${siteConfig.url}/es/${city.slug}`,
        'en-US': `${siteConfig.url}/en/${city.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      locale: isSpanish ? 'es_ES' : 'en_US',
      images: [
        {
          url: `${siteConfig.url}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: isSpanish ? `Abogados negligencias médicas ${city.name}` : `Medical negligence lawyers ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

// Obtener hospitales de la ciudad
async function getHospitalsForCity(cityName: string) {
  try {
    const supabase = getSupabaseAdmin()
    const { data: hospitals } = await supabase
      .from('hospitals')
      .select('*')
      .eq('city_name', cityName)
      .eq('is_active', true)
      .order('is_public', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(12)

    return hospitals || []
  } catch {
    return []
  }
}

export default async function CiudadPage({
  params,
}: {
  params: Promise<{ locale: string; ciudad: string }>
}) {
  const { locale, ciudad } = await params
  const city = cities.find((c) => c.slug === ciudad)

  if (!city) {
    notFound()
  }

  // Obtener hospitales de la ciudad (lugar del daño, no sucursal)
  const hospitals = await getHospitalsForCity(city.name)

  const isSpanish = locale === 'es'
  
  const tServices = await getTranslations({ locale: locale, namespace: 'services' })
  
  const serviceSlugMap: Record<string, string> = {
    'errores-quirurgicos': 'surgical-errors',
    'errores-diagnostico': 'diagnostic-errors',
    'negligencia-hospitalaria': 'hospital-negligence',
    'negligencia-obstetrica': 'obstetric-negligence',
    'errores-medicacion': 'medication-errors',
    'consentimiento-informado': 'informed-consent',
  }

  const cityFaqs = isSpanish
    ? [
        {
          question: `¿Tenéis despacho en ${city.name}?`,
          answer: `No. La sede está en Murcia (Plaza Fuensanta). Si el error médico ocurrió en ${city.name}, podemos llevar el caso igual: teléfono, videoconferencia, historia clínica y, si hace falta, nos desplazamos.`,
        },
        {
          question: `¿Cómo consulto un caso de negligencia médica ocurrido en ${city.name}?`,
          answer: `Llámanos al ${siteConfig.contact.phone} o escribe a ${siteConfig.contact.email}. Da igual que estés en ${city.name} o en otro sitio: te escuchamos, analizamos la documentación y te orientamos con honestidad.`,
        },
        {
          question: `¿Cómo sé si tengo un caso de negligencia médica en ${city.name}?`,
          answer: `Si has sufrido un daño por un error médico, diagnóstico tardío o tratamiento inadecuado en ${city.name}, puede haber caso. Contacta con nosotros y analizaremos tu situación con rigor profesional.`,
        },
        {
          question: `¿Cuánto tiempo tengo para reclamar por un daño ocurrido en ${city.name}?`,
          answer: `El plazo general es de 1 año desde que conoces el daño o desde que finaliza el tratamiento. Cada caso es distinto. Consúltanos cuanto antes para no perder derechos.`,
        },
        {
          question: `¿Qué hospitales de ${city.name} cubrís?`,
          answer: `Cubrimos casos ocurridos en hospitales públicos y privados de ${city.name}. El análisis lo hacemos con peritos; no hace falta una sucursal en la ciudad.`,
        },
      ]
    : [
        {
          question: `Do you have an office in ${city.name}?`,
          answer: `No. The firm is in Murcia (Plaza Fuensanta). If the medical error occurred in ${city.name}, we can still handle the case: phone, videocall, medical records and travel if needed.`,
        },
        {
          question: `How do I consult a medical negligence case that happened in ${city.name}?`,
          answer: `Call ${siteConfig.contact.phone} or email ${siteConfig.contact.email}. It does not matter if you are in ${city.name} or elsewhere: we listen, review the records and advise you honestly.`,
        },
        {
          question: `How do I know if I have a medical negligence case in ${city.name}?`,
          answer: `If you suffered harm due to a medical error, late diagnosis or inadequate treatment in ${city.name}, you may have a case. Contact us and we will review it with professional rigor.`,
        },
        {
          question: `How long do I have to claim for harm that occurred in ${city.name}?`,
          answer: `The general term is 1 year from when you know about the damage or when treatment ends. Each case is different. Contact us as soon as possible so as not to lose your rights.`,
        },
        {
          question: `Which hospitals in ${city.name} do you cover?`,
          answer: `We handle cases that occurred in public and private hospitals in ${city.name}. We work with medical experts; there is no need for a local branch.`,
        },
      ]

  const whyChooseUs = isSpanish
    ? [
        {
          icon: Shield,
          title: 'Especialización',
          description: `Especialistas en negligencias médicas. El caso puede haber ocurrido en ${city.province}; la dirección es desde Murcia.`,
        },
        {
          icon: Award,
          title: 'Desde 1946',
          description: 'Un bufete con trayectoria y experiencia acumulada en la defensa de los derechos del paciente.',
        },
        {
          icon: Users,
          title: 'Atención Personalizada',
          description: `Cada caso es único. Te escuchamos y analizamos tu situación con rigor y cercanía.`,
        },
        {
          icon: FileCheck,
          title: 'Honestidad',
          description: 'Te orientamos con transparencia sobre la viabilidad de tu caso y las opciones disponibles.',
        },
      ]
    : [
        {
          icon: Shield,
          title: 'Specialization',
          description: `Lawyers specialized in medical negligence. The case may have occurred in ${city.province}; the file is run from Murcia.`,
        },
        {
          icon: Award,
          title: 'Since 1946',
          description: 'A law firm with track record and accumulated experience in defending patient rights.',
        },
        {
          icon: Users,
          title: 'Personalized Attention',
          description: `Each case is unique. We listen to you and analyze your situation with rigor and closeness.`,
        },
        {
          icon: FileCheck,
          title: 'Honesty',
          description: 'We guide you transparently about the viability of your case and available options.',
        },
      ]

  const processSteps = isSpanish
    ? [
        {
          number: '01',
          title: 'Te Escuchamos',
          description: 'Te escuchamos, analizamos tu caso y te orientamos con honestidad.',
        },
        {
          number: '02',
          title: 'Análisis Pericial',
          description: `Estudiamos la documentación médica con peritos especializados para valorar tu caso.`,
        },
        {
          number: '03',
          title: 'Valoración',
          description: 'Te explicamos con claridad las opciones y la viabilidad de tu reclamación.',
        },
        {
          number: '04',
          title: 'Defensa',
          description: `Si procede, defendemos tu caso ante los tribunales competentes (el daño en ${city.province} se tramita allí; el despacho está en Murcia).`,
        },
        {
          number: '05',
          title: 'Acompañamiento',
          description: 'Te acompañamos durante todo el proceso, manteniéndote informado en cada paso.',
        },
      ]
    : [
        {
          number: '01',
          title: 'We Listen to You',
          description: 'We listen, analyze your case and guide you honestly.',
        },
        {
          number: '02',
          title: 'Expert Analysis',
          description: `We study the medical documentation with specialized experts to assess your case.`,
        },
        {
          number: '03',
          title: 'Assessment',
          description: 'We clearly explain the options and viability of your claim.',
        },
        {
          number: '04',
          title: 'Defense',
          description: `If appropriate, we defend your case before the competent courts (harm in ${city.province} is heard there; the firm is in Murcia).`,
        },
        {
          number: '05',
          title: 'Support',
          description: 'We accompany you throughout the process, keeping you informed at every step.',
        },
      ]

  return (
    <>
      {/* JSON-LD estructurado para SEO local */}
      <JsonLdLocalBusinessCity
        cityName={city.name}
        citySlug={city.slug}
        province={city.province}
        locale={locale}
      />
      <JsonLdBreadcrumbs
        items={[
          { name: isSpanish ? 'Inicio' : 'Home', url: siteConfig.url },
          { 
            name: isSpanish 
              ? `Abogados Negligencias Médicas ${city.name}` 
              : `Medical Negligence Lawyers ${city.name}`, 
            url: `${siteConfig.url}/${locale}/${city.slug}` 
          },
        ]}
      />
      <JsonLdFAQ faqs={cityFaqs} />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/error-medico-1408x704.jpg"
            alt={isSpanish ? `Abogados negligencias médicas ${city.name}` : `Medical negligence lawyers ${city.name}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/85 to-charcoal/75" />
        </div>

        <div className="container-custom relative z-10 py-16">
          <Breadcrumbs
            items={[{ 
              label: isSpanish 
                ? `Abogados Negligencias Médicas ${city.name}` 
                : `Medical Negligence Lawyers ${city.name}` 
            }]}
            className="mb-6 text-gray-400"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">
                {isSpanish
                  ? `${city.name} · despacho en Murcia`
                  : `${city.name} · office in Murcia`}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              {isSpanish ? (
                <>
                  Abogados Negligencias Médicas en{' '}
                  <span className="text-gold">{city.name}</span>
                </>
              ) : (
                <>
                  Medical Negligence Lawyers in{' '}
                  <span className="text-gold">{city.name}</span>
                </>
              )}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {isSpanish
                ? `Si el error médico ocurrió en ${city.name}, podemos llevar tu caso desde Murcia en todo el territorio: videoconferencia, historia clínica y, si hace falta, desplazamiento. Te escuchamos y te orientamos con rigor.`
                : `If the medical error occurred in ${city.name}, we can handle your case from Murcia nationwide: videocall, medical records and travel if needed. We listen and advise you with rigor.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href={`/${locale}/contacto`} className="btn-primary text-center">
                {isSpanish ? 'Háblanos de Tu Caso' : 'Tell Us About Your Case'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href={siteConfig.contact.phoneHref}
                className="btn-outline-white text-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                {siteConfig.contact.phone}
              </a>
            </div>

            {/* Credenciales */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl md:text-4xl font-serif font-bold text-gold">1946</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {isSpanish ? 'Desde' : 'Since'}
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-serif font-bold text-gold">{isSpanish ? 'Rigor' : 'Rigor'}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {isSpanish ? 'Profesional' : 'Professional'}
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-serif font-bold text-gold">{isSpanish ? 'Nobleza' : 'Nobility'}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {isSpanish ? 'En el servicio' : 'In service'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Locales */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {isSpanish ? 'Nuestros Servicios' : 'Our Services'}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
              {isSpanish 
                ? `Tipos de negligencias médicas en casos de ${city.name}`
                : `Types of medical negligence in cases from ${city.name}`}
            </h2>
            <p className="text-gray-600 text-lg">
              {isSpanish
                ? `Defendemos a víctimas de errores médicos ocurridos en ${city.province}. El despacho está en Murcia.`
                : `We defend victims of medical errors that occurred in ${city.province}. The firm is in Murcia.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const translationKey = serviceSlugMap[service.slug] || service.slug
              return (
                <Link
                  key={service.slug}
                  href={`/${locale}/negligencias-medicas/${service.slug}`}
                  className="group p-8 bg-cream hover:bg-white rounded-lg transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gold/20"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <ServiceIcon name={service.icon} className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-3 group-hover:text-gold transition-colors">
                    {tServices(`${translationKey}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tServices(`${translationKey}.description`)}
                  </p>
                  <div className="flex items-center text-gold font-semibold text-sm group-hover:gap-2 transition-all">
                    {isSpanish ? 'Más información' : 'Learn more'}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hospitales de la Ciudad */}
      {hospitals.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {isSpanish ? 'Hospitales' : 'Hospitals'}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                {isSpanish 
                  ? `Centros Sanitarios en ${city.name}` 
                  : `Healthcare Centers in ${city.name}`}
              </h2>
              <p className="text-gray-600 text-lg">
                {isSpanish
                  ? `Atendemos casos ocurridos en estos y otros hospitales de ${city.name}. El despacho está en Murcia.`
                  : `We handle cases that occurred in these and other hospitals in ${city.name}. The firm is in Murcia.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital: any) => (
                <div
                  key={hospital.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gold/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal mb-1 truncate">
                        {hospital.name}
                      </h3>
                      {hospital.is_public && (
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-2">
                          {isSpanish ? 'Público' : 'Public'}
                        </span>
                      )}
                      {hospital.rating && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                          {hospital.total_ratings > 0 && (
                            <span className="text-gray-400">({hospital.total_ratings})</span>
                          )}
                        </div>
                      )}
                      {hospital.address && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {hospital.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                {isSpanish
                  ? `¿Tu caso ocurrió en otro hospital de ${city.name}? También podemos ayudarte.`
                  : `Did your case occur at another hospital in ${city.name}? We can help you too.`}
              </p>
              <Link href={`/${locale}/contacto`} className="btn-primary">
                {isSpanish ? 'Consulta tu Caso' : 'Consult Your Case'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sanidad en la Ciudad */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {isSpanish ? 'Dónde ocurrió el daño' : 'Where the harm occurred'}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
                {isSpanish 
                  ? `La sanidad en ${city.name}` 
                  : `Healthcare in ${city.name}`}
                </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  {isSpanish
                    ? `${city.name} cuenta con una red sanitaria que incluye hospitales públicos y privados que atienden a la población de ${city.province}. Como en cualquier sistema sanitario, pueden producirse errores médicos que causan daños a los pacientes.`
                    : `${city.name} has a healthcare network that includes public and private hospitals serving the population of ${city.province}. As in any healthcare system, medical errors can occur that cause harm to patients.`}
                </p>
                <p>
                  {isSpanish
                    ? `Los casos más comunes incluyen errores quirúrgicos, diagnósticos tardíos, infecciones nosocomiales y errores de medicación. Analizamos la historia clínica y los protocolos del centro con peritos. No hace falta que el despacho esté en ${city.name}: la sede es Murcia y el servicio cubre todo el territorio.`
                    : `The most common cases include surgical errors, late diagnoses, hospital-acquired infections and medication errors. We review the medical records and the hospital protocols with experts. The firm does not need to be in ${city.name}: the office is in Murcia and we cover all of Spain.`}
                </p>
                <p>
                  {isSpanish
                    ? `Si has sufrido una negligencia médica en ${city.name}, conviene actuar pronto. Los plazos son estrictos y la prueba es clave para el caso.`
                    : `If you have suffered medical negligence in ${city.name}, it is worth acting soon. Deadlines are strict and evidence is crucial.`}
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/abogados_negligencias_medicas_negligencia_hospital.jpg"
                alt={isSpanish ? `Negligencias médicas ${city.name}` : `Medical negligence ${city.name}`}
                width={672}
                height={448}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="section-padding bg-charcoal text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {isSpanish ? 'Ventajas' : 'Advantages'}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {isSpanish 
                ? `Por qué un despacho de Murcia para un caso en ${city.name}`
                : `Why a Murcia firm for a case in ${city.name}`}
            </h2>
            <p className="text-gray-400 text-lg">
              {isSpanish
                ? 'Especialistas en negligencias médicas. Sede en Murcia, casos en toda España.'
                : 'Medical negligence specialists. Based in Murcia, cases nationwide.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {isSpanish ? 'Nuestro Proceso' : 'Our Process'}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
              {isSpanish 
                ? `Cómo llevamos un caso ocurrido en ${city.name}`
                : `How we handle a case that occurred in ${city.name}`}
            </h2>
            <p className="text-gray-600 text-lg">
              {isSpanish
                ? 'Un proceso transparente y efectivo para conseguir tu indemnización.'
                : 'A transparent and effective process to obtain your compensation.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center font-serif font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href={`/${locale}/contacto`} className="btn-primary">
              {isSpanish ? 'Empezar mi Caso Ahora' : 'Start My Case Now'}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Visibles */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {isSpanish ? 'Preguntas Frecuentes' : 'FAQ'}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                {isSpanish 
                  ? `Dudas sobre un caso de ${city.name}`
                  : `Questions about a case in ${city.name}`}
              </h2>
            </div>

            <div className="space-y-4">
              {cityFaqs.map((faq, index) => (
                <details key={index} className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-charcoal pr-4">{faq.question}</h3>
                    <ChevronRight className="w-5 h-5 text-gold flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                {isSpanish 
                  ? '¿Tienes más preguntas? Contacta con nosotros.' 
                  : 'Have more questions? Contact us.'}
              </p>
              <Link href={`/${locale}/preguntas-frecuentes`} className="text-gold font-semibold hover:text-gold-dark transition-colors inline-flex items-center gap-2">
                {isSpanish ? 'Ver todas las preguntas frecuentes' : 'View all FAQs'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
