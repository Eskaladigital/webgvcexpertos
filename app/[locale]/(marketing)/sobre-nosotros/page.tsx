import type { Metadata } from 'next'
import Image from 'next/image'
import { Scale, Users, Award, Target } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CtaFinal } from '@/components/home'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  return {
    title: isSpanish
      ? 'Sobre Nosotros | Un Bufete con Historia desde 1946'
      : 'About Us | A Law Firm with History Since 1946',
    description: isSpanish
      ? 'Fundado en 1946 por Blas García-Valcárcel. Un despacho multidisciplinar que encarna la nobleza profesional: ser preclaro, ilustre, generoso y honroso.'
      : 'Founded in 1946 by Blas García-Valcárcel. A multidisciplinary firm embodying professional nobility: being illustrious, generous and honorable.',
    alternates: {
      canonical: `/${locale}/sobre-nosotros`,
    },
  }
}

const valuesEs = [
  {
    icon: Award,
    title: 'Nobleza',
    description: 'El león, símbolo de nuestro bufete, encarna la nobleza: ser preclaro, ilustre, generoso, honroso y estimable.',
  },
  {
    icon: Scale,
    title: 'Rigor',
    description: 'Analizamos cada caso con la profundidad y el conocimiento que solo da la experiencia acumulada.',
  },
  {
    icon: Users,
    title: 'Cercanía',
    description: 'Tratamos cada caso con la atención y empatía que requiere, entendiendo el momento difícil que atraviesas.',
  },
  {
    icon: Target,
    title: 'Honestidad',
    description: 'Te orientamos con transparencia sobre las opciones disponibles y la viabilidad de tu caso.',
  },
]

const valuesEn = [
  {
    icon: Award,
    title: 'Nobility',
    description: 'The lion, symbol of our firm, embodies nobility: being illustrious, generous, honorable and estimable.',
  },
  {
    icon: Scale,
    title: 'Rigor',
    description: 'We analyze each case with the depth and knowledge that only accumulated experience provides.',
  },
  {
    icon: Users,
    title: 'Closeness',
    description: 'We treat each case with the attention and empathy it requires, understanding the difficult moment you are going through.',
  },
  {
    icon: Target,
    title: 'Honesty',
    description: 'We guide you transparently about the available options and the viability of your case.',
  },
]

export default async function SobreNosotrosPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  const values = isSpanish ? valuesEs : valuesEn
  
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Sobre Nosotros' : 'About Us' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            {isSpanish ? (
              <>
                Sobre <span className="text-gold">Nosotros</span>
              </>
            ) : (
              <>
                About <span className="text-gold">Us</span>
              </>
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {isSpanish
              ? 'Un despacho con amplia trayectoria y especialización en la defensa de los derechos del paciente.'
              : 'A law firm with extensive experience and specialization in defending patient rights.'}
          </p>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold text-sm font-semibold uppercase tracking-widest">
                {isSpanish ? 'Nuestra Historia' : 'Our History'}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-3 mb-6">
                {isSpanish ? 'Pioneros en Derecho Sanitario' : 'Pioneers in Health Law'}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {isSpanish ? (
                  <>
                    <p>
                      Este bufete fue fundado por D. Pedro-Alfonso García-Valcárcel y Escribano 
                      junto a su tío D. Blas García-Valcárcel, quien ejercía como abogado 
                      desde el 6 de noviembre de 1946.
                    </p>
                    <p>
                      Somos un despacho multidisciplinar que trabaja tanto en el ámbito del 
                      derecho privado como público, adaptando nuestros conocimientos y equipo 
                      de expertos a las necesidades de cada cliente.
                    </p>
                    <p>
                      A lo largo de nuestra trayectoria, hemos desarrollado una sólida 
                      especialización en negligencias médicas, ofreciendo un servicio 
                      diferencial centrado en la defensa del paciente.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      This firm was founded by Pedro-Alfonso García-Valcárcel y Escribano 
                      together with his uncle Blas García-Valcárcel, who practiced law 
                      since November 6, 1946.
                    </p>
                    <p>
                      We are a multidisciplinary firm that works in both private and public 
                      law, adapting our knowledge and team of experts to the needs of each client.
                    </p>
                    <p>
                      Throughout our history, we have developed a strong specialization 
                      in medical negligence, offering a differential service focused 
                      on patient defense.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-sm overflow-hidden shadow-xl">
                <Image
                  src="/images/abogados_negligencias_medicas_negligencia_hospital.jpg"
                  alt={isSpanish ? 'Equipo GVC Expertos' : 'GVC Expertos Team'}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 rounded-sm shadow-lg">
                <p className="text-4xl font-serif font-bold">1946</p>
                <p className="text-sm uppercase tracking-wide">
                  {isSpanish ? 'Desde' : 'Since'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              {isSpanish ? 'Nuestros Valores' : 'Our Values'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-3 mb-5">
              {isSpanish ? 'Lo Que Nos Define' : 'What Defines Us'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {isSpanish
                ? 'Estos principios guían cada una de nuestras acciones y nos comprometen a ofrecer siempre el mejor servicio a nuestros clientes.'
                : 'These principles guide each of our actions and commit us to always offer the best service to our clients.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-sm shadow-md text-center group hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold transition-colors">
                  <value.icon className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-gold text-sm font-semibold uppercase tracking-widest">
                {isSpanish ? 'Por Qué Elegirnos' : 'Why Choose Us'}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-3">
                {isSpanish ? 'La Diferencia GVC' : 'The GVC Difference'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isSpanish ? (
                <>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Especialización Reconocida
                    </h3>
                    <p className="text-gray-600">
                      Décadas de experiencia en derecho sanitario nos permiten 
                      abordar cada caso con un conocimiento profundo de esta 
                      área del derecho.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Equipo Multidisciplinar
                    </h3>
                    <p className="text-gray-600">
                      Trabajamos con médicos forenses, peritos especializados y
                      profesionales sanitarios que nos permiten entender cada caso
                      desde todas las perspectivas.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Te Escuchamos
                    </h3>
                    <p className="text-gray-600">
                      Analizamos tu caso con rigor. Te orientamos con 
                      honestidad sobre las opciones disponibles y la viabilidad 
                      de tu reclamación.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Atención Personalizada
                    </h3>
                    <p className="text-gray-600">
                      Cada caso es único. Te escuchamos, te acompañamos y te 
                      mantenemos informado durante todo el proceso.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Recognized Specialization
                    </h3>
                    <p className="text-gray-600">
                      Decades of experience in healthcare law allow us to 
                      approach each case with deep knowledge of this 
                      area of law.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Multidisciplinary Team
                    </h3>
                    <p className="text-gray-600">
                      We work with forensic doctors, specialized experts and
                      healthcare professionals who allow us to understand each case
                      from all perspectives.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      We Listen to You
                    </h3>
                    <p className="text-gray-600">
                      We analyze your case with rigor. We guide you 
                      honestly about the available options and the viability 
                      of your claim.
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                      Personalized Attention
                    </h3>
                    <p className="text-gray-600">
                      Every case is unique. We listen to you, accompany you and 
                      keep you informed throughout the entire process.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
