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
    title: isSpanish ? 'Política de Privacidad' : 'Privacy Policy',
    description: isSpanish
      ? 'Política de privacidad y protección de datos de GVC Expertos.'
      : 'Privacy policy and data protection of GVC Expertos.',
    alternates: {
      canonical: `/${locale}/politica-privacidad`,
    },
  }
}

export default async function PoliticaPrivacidadPage({
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
            items={[{ label: isSpanish ? 'Política de Privacidad' : 'Privacy Policy' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            {isSpanish ? (
              <>
                Política de <span className="text-gold">Privacidad</span>
              </>
            ) : (
              <>
                Privacy <span className="text-gold">Policy</span>
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
                <p className="lead">
                  En {siteConfig.legal.company}, con CIF {siteConfig.legal.cif},
                  tratamos la información que nos facilitan las personas interesadas
                  con el fin de prestar nuestros servicios profesionales.
                </p>

                <h2>1. Responsable del tratamiento</h2>
                <ul>
                  <li>
                    <strong>Identidad:</strong> {siteConfig.legal.company}
                  </li>
                  <li>
                    <strong>CIF:</strong> {siteConfig.legal.cif}
                  </li>
                  <li>
                    <strong>Dirección:</strong> {siteConfig.contact.address}
                  </li>
                  <li>
                    <strong>Email:</strong> {siteConfig.contact.email}
                  </li>
                  <li>
                    <strong>Teléfono:</strong> {siteConfig.contact.phone}
                  </li>
                </ul>

                <h2>2. Finalidad del tratamiento</h2>
                <p>Los datos personales se tratan con las siguientes finalidades:</p>
                <ul>
                  <li>
                    Gestionar las consultas y solicitudes de información recibidas a
                    través de nuestros formularios de contacto.
                  </li>
                  <li>
                    Prestar los servicios profesionales de asesoramiento jurídico
                    contratados.
                  </li>
                  <li>
                    Enviar comunicaciones comerciales sobre nuestros servicios,
                    siempre que el usuario haya dado su consentimiento.
                  </li>
                </ul>

                <h2>3. Legitimación</h2>
                <p>
                  La base legal para el tratamiento de los datos es el consentimiento
                  del interesado y/o la ejecución de un contrato de prestación de
                  servicios profesionales.
                </p>

                <h2>4. Destinatarios</h2>
                <p>
                  Los datos no serán cedidos a terceros salvo obligación legal o
                  cuando sea necesario para la prestación del servicio contratado
                  (por ejemplo, comunicaciones con juzgados, administraciones
                  públicas, etc.).
                </p>

                <h2>5. Derechos</h2>
                <p>
                  El interesado puede ejercer los siguientes derechos respecto a sus
                  datos:
                </p>
                <ul>
                  <li>Derecho de acceso</li>
                  <li>Derecho de rectificación</li>
                  <li>Derecho de supresión</li>
                  <li>Derecho de limitación del tratamiento</li>
                  <li>Derecho de portabilidad</li>
                  <li>Derecho de oposición</li>
                </ul>
                <p>
                  Para ejercer estos derechos, puede dirigirse a{' '}
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>{' '}
                  o a nuestra dirección postal.
                </p>

                <h2>6. Conservación de datos</h2>
                <p>
                  Los datos se conservarán durante el tiempo necesario para cumplir
                  con la finalidad para la que se recabaron y para determinar las
                  posibles responsabilidades derivadas de dicha finalidad y del
                  tratamiento de los datos.
                </p>

                <h2>7. Seguridad</h2>
                <p>
                  Hemos adoptado las medidas técnicas y organizativas necesarias para
                  garantizar la seguridad de los datos personales y evitar su
                  alteración, pérdida, tratamiento o acceso no autorizado.
                </p>

                <h2>8. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho a modificar esta política de privacidad
                  para adaptarla a novedades legislativas o jurisprudenciales.
                </p>

                <p className="text-sm text-gray-500 mt-8">
                  Última actualización: Diciembre 2024
                </p>
              </>
            ) : (
              <>
                <p className="lead">
                  At {siteConfig.legal.company}, with Tax ID {siteConfig.legal.cif},
                  we process the information provided by interested parties in order
                  to provide our professional services.
                </p>

                <h2>1. Data Controller</h2>
                <ul>
                  <li>
                    <strong>Identity:</strong> {siteConfig.legal.company}
                  </li>
                  <li>
                    <strong>Tax ID:</strong> {siteConfig.legal.cif}
                  </li>
                  <li>
                    <strong>Address:</strong> {siteConfig.contact.address}
                  </li>
                  <li>
                    <strong>Email:</strong> {siteConfig.contact.email}
                  </li>
                  <li>
                    <strong>Phone:</strong> {siteConfig.contact.phone}
                  </li>
                </ul>

                <h2>2. Purpose of Processing</h2>
                <p>Personal data is processed for the following purposes:</p>
                <ul>
                  <li>
                    Manage inquiries and information requests received through our
                    contact forms.
                  </li>
                  <li>
                    Provide professional legal advisory services contracted.
                  </li>
                  <li>
                    Send commercial communications about our services, provided the
                    user has given their consent.
                  </li>
                </ul>

                <h2>3. Legal Basis</h2>
                <p>
                  The legal basis for data processing is the consent of the data
                  subject and/or the execution of a professional services contract.
                </p>

                <h2>4. Recipients</h2>
                <p>
                  Data will not be transferred to third parties except when required
                  by law or when necessary for the provision of the contracted service
                  (for example, communications with courts, public administrations,
                  etc.).
                </p>

                <h2>5. Rights</h2>
                <p>
                  The data subject may exercise the following rights regarding their
                  data:
                </p>
                <ul>
                  <li>Right of access</li>
                  <li>Right of rectification</li>
                  <li>Right of erasure</li>
                  <li>Right to restriction of processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object</li>
                </ul>
                <p>
                  To exercise these rights, you can contact{' '}
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>{' '}
                  or our postal address.
                </p>

                <h2>6. Data Retention</h2>
                <p>
                  Data will be retained for the time necessary to fulfill the purpose
                  for which they were collected and to determine possible
                  responsibilities arising from that purpose and data processing.
                </p>

                <h2>7. Security</h2>
                <p>
                  We have adopted the necessary technical and organizational measures to
                  guarantee the security of personal data and prevent its alteration,
                  loss, processing or unauthorized access.
                </p>

                <h2>8. Modifications</h2>
                <p>
                  We reserve the right to modify this privacy policy to adapt it to
                  legislative or jurisprudential developments.
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
