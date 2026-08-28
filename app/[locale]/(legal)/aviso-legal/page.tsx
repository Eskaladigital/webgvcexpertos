import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { siteConfig } from '@/config/site'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isSpanish = locale === 'es'
  
  return {
    title: isSpanish ? 'Aviso Legal' : 'Legal Notice',
    description: isSpanish
      ? 'Aviso legal y condiciones de uso del sitio web de GVC Expertos.'
      : 'Legal notice and terms of use of the GVC Expertos website.',
    alternates: {
      canonical: `/${locale}/aviso-legal`,
    },
  }
}

export default async function AvisoLegalPage({
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
            items={[{ label: isSpanish ? 'Aviso Legal' : 'Legal Notice' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            {isSpanish ? (
              <>
                Aviso <span className="text-gold">Legal</span>
              </>
            ) : (
              <>
                Legal <span className="text-gold">Notice</span>
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
                <h2>1. Datos identificativos</h2>
                <p>
                  En cumplimiento del deber de información recogido en el artículo 10
                  de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de
                  la Información y del Comercio Electrónico, se detallan los
                  siguientes datos:
                </p>
                <ul>
                  <li>
                    <strong>Denominación social:</strong> {siteConfig.legal.company}
                  </li>
                  <li>
                    <strong>CIF:</strong> {siteConfig.legal.cif}
                  </li>
                  <li>
                    <strong>Domicilio social:</strong> {siteConfig.contact.address}
                  </li>
                  <li>
                    <strong>Email:</strong> {siteConfig.contact.email}
                  </li>
                  <li>
                    <strong>Teléfono:</strong> {siteConfig.contact.phone}
                  </li>
                  <li>
                    <strong>Inscripción:</strong> {siteConfig.legal.registroMercantil}
                  </li>
                </ul>

                <h2>2. Objeto</h2>
                <p>
                  El presente sitio web tiene por objeto facilitar información sobre
                  los servicios profesionales de asesoramiento jurídico especializado
                  en negligencias médicas que presta {siteConfig.legal.company}.
                </p>

                <h2>3. Propiedad intelectual</h2>
                <p>
                  Todos los contenidos de este sitio web (incluyendo, sin limitación,
                  textos, fotografías, gráficos, imágenes, iconos, tecnología,
                  software, links y demás contenidos audiovisuales) son propiedad de{' '}
                  {siteConfig.legal.company} o de terceros que han autorizado su uso.
                </p>
                <p>
                  Queda prohibida cualquier forma de reproducción, distribución,
                  comunicación pública, transformación o cualquier otra actividad que
                  se pueda realizar con los contenidos de este sitio web sin la
                  autorización expresa de {siteConfig.legal.company}.
                </p>

                <h2>4. Responsabilidades</h2>
                <p>
                  {siteConfig.legal.company} no garantiza la inexistencia de errores
                  en el acceso al sitio web, en su contenido, ni que éste se
                  encuentre actualizado, aunque se compromete a realizar todos los
                  esfuerzos necesarios para evitar, subsanar o actualizar dichos
                  errores.
                </p>
                <p>
                  {siteConfig.legal.company} no se hace responsable de los posibles
                  daños o perjuicios que se pudieran derivar de interferencias,
                  omisiones, interrupciones, virus informáticos, averías telefónicas
                  o desconexiones en el funcionamiento de este sistema electrónico.
                </p>

                <h2>5. Modificaciones</h2>
                <p>
                  {siteConfig.legal.company} se reserva el derecho de efectuar las
                  modificaciones que considere oportunas en su sitio web, pudiendo
                  cambiar, suprimir o añadir tanto los contenidos como los servicios
                  que se presten a través del mismo.
                </p>

                <h2>6. Enlaces</h2>
                <p>
                  Este sitio web puede contener enlaces a páginas externas sobre las
                  cuales {siteConfig.legal.company} no tiene control ni
                  responsabilidad sobre su contenido o disponibilidad.
                </p>

                <h2>7. Legislación aplicable</h2>
                <p>
                  La relación entre {siteConfig.legal.company} y el usuario se regirá
                  por la normativa española vigente. Para la resolución de cualquier
                  controversia, las partes se someten a los Juzgados y Tribunales de
                  Murcia.
                </p>

                <p className="text-sm text-gray-500 mt-8">
                  Última actualización: Diciembre 2024
                </p>
              </>
            ) : (
              <>
                <h2>1. Identifying Information</h2>
                <p>
                  In compliance with the duty of information contained in article 10
                  of Law 34/2002, of July 11, on Information Society Services and
                  Electronic Commerce, the following data are detailed:
                </p>
                <ul>
                  <li>
                    <strong>Company name:</strong> {siteConfig.legal.company}
                  </li>
                  <li>
                    <strong>Tax ID:</strong> {siteConfig.legal.cif}
                  </li>
                  <li>
                    <strong>Registered address:</strong> {siteConfig.contact.address}
                  </li>
                  <li>
                    <strong>Email:</strong> {siteConfig.contact.email}
                  </li>
                  <li>
                    <strong>Phone:</strong> {siteConfig.contact.phone}
                  </li>
                  <li>
                    <strong>Registration:</strong> {siteConfig.legal.registroMercantil}
                  </li>
                </ul>

                <h2>2. Purpose</h2>
                <p>
                  This website aims to provide information about the professional
                  legal advisory services specialized in medical negligence provided
                  by {siteConfig.legal.company}.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                  All contents of this website (including, without limitation,
                  texts, photographs, graphics, images, icons, technology, software,
                  links and other audiovisual content) are the property of{' '}
                  {siteConfig.legal.company} or third parties who have authorized
                  their use.
                </p>
                <p>
                  Any form of reproduction, distribution, public communication,
                  transformation or any other activity that may be carried out with
                  the contents of this website without the express authorization of{' '}
                  {siteConfig.legal.company} is prohibited.
                </p>

                <h2>4. Responsibilities</h2>
                <p>
                  {siteConfig.legal.company} does not guarantee the absence of
                  errors in access to the website, in its content, or that it is
                  up to date, although it undertakes to make all necessary efforts
                  to avoid, correct or update such errors.
                </p>
                <p>
                  {siteConfig.legal.company} is not responsible for possible damages
                  or losses that may arise from interference, omissions, interruptions,
                  computer viruses, telephone breakdowns or disconnections in the
                  operation of this electronic system.
                </p>

                <h2>5. Modifications</h2>
                <p>
                  {siteConfig.legal.company} reserves the right to make the
                  modifications it deems appropriate to its website, being able to
                  change, delete or add both the contents and the services provided
                  through it.
                </p>

                <h2>6. Links</h2>
                <p>
                  This website may contain links to external pages over which{' '}
                  {siteConfig.legal.company} has no control or responsibility for
                  their content or availability.
                </p>

                <h2>7. Applicable Legislation</h2>
                <p>
                  The relationship between {siteConfig.legal.company} and the user
                  will be governed by current Spanish regulations. For the resolution
                  of any controversy, the parties submit to the Courts and Tribunals
                  of Murcia.
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



