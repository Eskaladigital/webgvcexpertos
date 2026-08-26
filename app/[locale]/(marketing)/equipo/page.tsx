import type { Metadata } from 'next'
import Image from 'next/image'
import { Linkedin, Mail } from 'lucide-react'
import { teamMembers, siteConfig } from '@/config/site'
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
      ? 'Nuestro Equipo | Los Profesionales de GVC Expertos'
      : 'Our Team | The Professionals at GVC Expertos',
    description: isSpanish
      ? 'Pedro Alfonso García-Valcárcel, fundador en 1968, lidera un equipo de abogados comprometidos con el rigor, la cercanía y la defensa del paciente.'
      : 'Pedro Alfonso García-Valcárcel, founder in 1968, leads a team of lawyers committed to rigor, closeness and patient defense.',
    alternates: {
      canonical: `/${locale}/equipo`,
    },
  }
}

// Bios extendidas para cada miembro - Español
const teamBiosEs: Record<string, string> = {
  'pedro-alfonso-garcia-valcarcel':
    'Abogado y fundador del bufete. Licenciado en Derecho por la Universidad de Murcia en el año 1968. Con más de 55 años de experiencia en el ejercicio de la abogacía, es un referente en derecho sanitario y defensa de víctimas de negligencias médicas.',
  'raquel-garcia-valcarcel':
    'Abogada. Licenciada en Derecho por la Universidad Nacional de Educación a Distancia (UNED) en el año 1999. Especializada en negligencias obstétricas y ginecológicas, dirige el departamento de reclamaciones médicas del despacho.',
  'miguel-caceres-sanchez':
    'Abogado. Licenciado en Derecho por la Universidad de Almería en el año 2000. Especialista en errores de diagnóstico y tratamiento, con amplia experiencia en litigios contra hospitales y centros sanitarios.',
  'olga-martinez-martinez':
    'Abogada. Licenciada en Derecho por la Universidad de Murcia en el año 2001 y doctorando en Derecho Civil. Especializada en negligencias quirúrgicas y hospitalarias, destaca por su meticulosidad en el análisis de historiales clínicos.',
  'carmen-martinez-ramon':
    'Secretaria de Dirección. Titulada por el Instituto Politécnico F.P. de Albacete en 1996. Gestiona la coordinación administrativa de expedientes y asegura una atención personalizada a cada cliente.',
}

// Bios extendidas para cada miembro - Inglés
const teamBiosEn: Record<string, string> = {
  'pedro-alfonso-garcia-valcarcel':
    'Lawyer and founder of the firm. Law degree from the University of Murcia in 1968. With over 55 years of experience in legal practice, he is a reference in health law and defense of victims of medical negligence.',
  'raquel-garcia-valcarcel':
    'Lawyer. Law degree from the National University of Distance Education (UNED) in 1999. Specialized in obstetric and gynecological negligence, she heads the medical claims department of the firm.',
  'miguel-caceres-sanchez':
    'Lawyer. Law degree from the University of Almería in 2000. Specialist in diagnostic and treatment errors, with extensive experience in litigation against hospitals and healthcare centers.',
  'olga-martinez-martinez':
    'Lawyer. Law degree from the University of Murcia in 2001 and PhD candidate in Civil Law. Specialized in surgical and hospital negligence, she stands out for her meticulousness in analyzing clinical records.',
  'carmen-martinez-ramon':
    'Executive Secretary. Graduate from the Instituto Politécnico F.P. of Albacete in 1996. Manages the administrative coordination of files and ensures personalized attention to each client.',
}

export default async function EquipoPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  const teamBios = isSpanish ? teamBiosEs : teamBiosEn
  
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Equipo' : 'Team' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            {isSpanish ? (
              <>
                Nuestro <span className="text-gold">Equipo</span>
              </>
            ) : (
              <>
                Our <span className="text-gold">Team</span>
              </>
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {isSpanish
              ? 'Un equipo de profesionales altamente cualificados y especializados en derecho sanitario, comprometidos con la defensa de tus derechos.'
              : 'A team of highly qualified professionals specialized in health law, committed to defending your rights.'}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.slug}
                className="bg-white rounded-sm shadow-md overflow-hidden group"
              >
                {/* Photo */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Info */}
                <div className="p-6">
                  <h2 className="text-xl font-serif font-semibold text-charcoal mb-1">
                    {member.name}
                  </h2>
                  <span className="text-gold text-sm uppercase tracking-wider font-medium block mb-4">
                    {member.position}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {teamBios[member.slug] || (isSpanish 
                      ? 'Profesional especializado en negligencias médicas.'
                      : 'Professional specialized in medical negligence.')}
                  </p>
                  
                  {/* Social */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <a
                      href="#"
                      className="w-9 h-9 bg-cream rounded-full flex items-center justify-center hover:bg-gold group/icon transition-colors"
                      aria-label={`LinkedIn ${isSpanish ? 'de' : 'of'} ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4 text-charcoal group-hover/icon:text-white transition-colors" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 bg-cream rounded-full flex items-center justify-center hover:bg-gold group/icon transition-colors"
                      aria-label={`Email ${isSpanish ? 'de' : 'of'} ${member.name}`}
                    >
                      <Mail className="w-4 h-4 text-charcoal group-hover/icon:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
              {isSpanish ? 'Únete a Nuestro Equipo' : 'Join Our Team'}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {isSpanish ? (
                <>
                  Si eres abogado especializado en derecho sanitario y compartes
                  nuestra pasión por defender los derechos de los pacientes, nos
                  encantaría conocerte. Envíanos tu CV a{' '}
                  <a href="mailto:contacto@gvcabogados.com" className="text-gold hover:underline">
                    contacto@gvcabogados.com
                  </a>
                </>
              ) : (
                <>
                  If you are a lawyer specialized in health law and share
                  our passion for defending patients' rights, we would love to meet you. Send us your CV to{' '}
                  <a href="mailto:contacto@gvcabogados.com" className="text-gold hover:underline">
                    contacto@gvcabogados.com
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
