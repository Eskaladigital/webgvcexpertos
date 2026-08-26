import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Accordion } from '@/components/ui/Accordion'
import { CtaFinal } from '@/components/home'
import { JsonLdFAQ } from '@/components/seo/JsonLd'
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
      ? 'Preguntas Frecuentes | Negligencias Médicas'
      : 'Frequently Asked Questions | Medical Negligence',
    description: isSpanish
      ? 'Resolvemos tus dudas sobre negligencias médicas: plazos de reclamación, indemnizaciones, proceso legal y más. Consulta nuestras FAQ.'
      : 'We answer your questions about medical negligence: claim deadlines, compensation, legal process and more. Check our FAQ.',
    alternates: {
      canonical: `/${locale}/preguntas-frecuentes`,
    },
  }
}

const faqCategoriesEs = [
  {
    title: 'Sobre Negligencias Médicas',
    faqs: [
      {
        id: 'q1',
        title: '¿Qué es una negligencia médica?',
        content:
          'Una negligencia médica se produce cuando un profesional sanitario actúa de manera imprudente o negligente, apartándose de lo que se considera buena práctica médica (lex artis), y como consecuencia causa un daño al paciente que podría haberse evitado.',
      },
      {
        id: 'q2',
        title: '¿Cómo sé si he sufrido una negligencia médica?',
        content:
          'Para determinar si has sufrido una negligencia médica es necesario analizar si la actuación del profesional sanitario se ajustó a los protocolos establecidos. Te recomendamos contactar con nuestros abogados especializados para una valoración de tu caso.',
      },
      {
        id: 'q3',
        title: '¿Qué diferencia hay entre una complicación y una negligencia?',
        content:
          'Una complicación es un resultado adverso que puede producirse incluso con una actuación médica correcta. Una negligencia implica que el daño se produjo por una actuación incorrecta o imprudente del profesional. Esta distinción es clave y requiere análisis pericial especializado.',
      },
    ],
  },
  {
    title: 'Sobre el Proceso de Reclamación',
    faqs: [
      {
        id: 'q4',
        title: '¿Cuánto tiempo tengo para reclamar una negligencia médica?',
        content:
          'El plazo general es de 1 año desde que se conoce el daño o sus consecuencias. Sin embargo, este plazo puede variar según el tipo de responsabilidad (pública o privada) y las circunstancias del caso. Es fundamental actuar cuanto antes para no perder tu derecho.',
      },
      {
        id: 'q5',
        title: '¿Qué documentación necesito para iniciar una reclamación?',
        content:
          'Necesitarás tu historia clínica completa, informes médicos, pruebas diagnósticas, recetas y cualquier documento relacionado con tu atención sanitaria. Nosotros te ayudamos a solicitar toda la documentación necesaria.',
      },
      {
        id: 'q6',
        title: '¿Es necesario ir a juicio?',
        content:
          'No siempre. Muchos casos se resuelven mediante acuerdo extrajudicial con la aseguradora del centro o profesional. Solo recurrimos a la vía judicial cuando no es posible alcanzar un acuerdo satisfactorio para el cliente.',
      },
      {
        id: 'q7',
        title: '¿Cuánto dura el proceso de reclamación?',
        content:
          'La duración depende de cada caso. Un acuerdo extrajudicial puede resolverse en 6-12 meses. Si es necesario acudir a juicio, el proceso puede durar entre 2 y 4 años. Te mantendremos informado en cada fase.',
      },
    ],
  },
  {
    title: 'Sobre Indemnizaciones',
    faqs: [
      {
        id: 'q8',
        title: '¿Qué indemnización puedo recibir por una negligencia médica?',
        content:
          'La indemnización se calcula según el baremo de accidentes y puede incluir: gastos médicos y de tratamiento, pérdida de ingresos, daño moral, secuelas permanentes y necesidad de ayuda de terceras personas. Cada caso se valora individualmente.',
      },
      {
        id: 'q9',
        title: '¿Cuánto cuesta consultar con vosotros?',
        content:
          'Te escuchamos, analizamos tu caso y te orientamos con honestidad sobre las opciones disponibles y la viabilidad de tu reclamación.',
      },
      {
        id: 'q10',
        title: '¿Quién paga la indemnización?',
        content:
          'Generalmente es la compañía de seguros del profesional o centro sanitario la que abona la indemnización. Todos los profesionales sanitarios están obligados a tener un seguro de responsabilidad civil.',
      },
    ],
  },
  {
    title: 'Sobre Nuestro Despacho',
    faqs: [
      {
        id: 'q11',
        title: '¿Por qué elegir GVC Expertos?',
        content:
          'Somos un bufete con raíces desde 1946, un despacho multidisciplinar con sólida especialización en negligencias médicas. Colaboramos con peritos médicos para analizar cada caso con rigor y nobleza profesional.',
      },
      {
        id: 'q12',
        title: '¿Trabajáis en toda España?',
        content:
          'Sí, atendemos casos en toda España. Tenemos sede en Murcia y podemos gestionar tu caso independientemente de dónde te encuentres.',
      },
      {
        id: 'q13',
        title: '¿Cómo puedo contactar con vosotros?',
        content:
          'Puedes llamarnos al 968 241 025, enviarnos un email a contacto@gvcabogados.com o visitar nuestras oficinas en Plaza Fuensanta, 3 - 6ºB, 30008 Murcia. Te atenderemos de forma personalizada.',
      },
    ],
  },
]

const faqCategoriesEn = [
  {
    title: 'About Medical Negligence',
    faqs: [
      {
        id: 'q1',
        title: 'What is medical negligence?',
        content:
          'Medical negligence occurs when a healthcare professional acts recklessly or negligently, deviating from what is considered good medical practice (lex artis), and as a result causes harm to the patient that could have been avoided.',
      },
      {
        id: 'q2',
        title: 'How do I know if I have suffered medical negligence?',
        content:
          'To determine if you have suffered medical negligence, it is necessary to analyze whether the healthcare professional\'s actions complied with established protocols. We recommend contacting our specialized lawyers for an assessment of your case.',
      },
      {
        id: 'q3',
        title: 'What is the difference between a complication and negligence?',
        content:
          'A complication is an adverse outcome that can occur even with correct medical action. Negligence implies that the damage was caused by incorrect or reckless action by the professional. This distinction is key and requires specialized expert analysis.',
      },
    ],
  },
  {
    title: 'About the Claim Process',
    faqs: [
      {
        id: 'q4',
        title: 'How long do I have to claim medical negligence?',
        content:
          'The general term is 1 year from when the damage or its consequences are known. However, this term may vary depending on the type of liability (public or private) and the circumstances of the case. It is essential to act as soon as possible so as not to lose your right.',
      },
      {
        id: 'q5',
        title: 'What documentation do I need to start a claim?',
        content:
          'You will need your complete medical history, medical reports, diagnostic tests, prescriptions and any document related to your healthcare. We help you request all necessary documentation.',
      },
      {
        id: 'q6',
        title: 'Is it necessary to go to court?',
        content:
          'Not always. Many cases are resolved through out-of-court settlement with the insurer of the center or professional. We only resort to legal proceedings when it is not possible to reach a satisfactory agreement for the client.',
      },
      {
        id: 'q7',
        title: 'How long does the claim process take?',
        content:
          'The duration depends on each case. An out-of-court settlement can be resolved in 6-12 months. If it is necessary to go to court, the process can take between 2 and 4 years. We will keep you informed at each phase.',
      },
    ],
  },
  {
    title: 'About Compensation',
    faqs: [
      {
        id: 'q8',
        title: 'What compensation can I receive for medical negligence?',
        content:
          'Compensation is calculated according to the accident scale and may include: medical and treatment expenses, loss of income, moral damage, permanent sequelae and need for third-party assistance. Each case is assessed individually.',
      },
      {
        id: 'q9',
        title: 'How much does it cost to consult with you?',
        content:
          'We listen to you, analyze your case and guide you honestly about the available options and the viability of your claim.',
      },
      {
        id: 'q10',
        title: 'Who pays the compensation?',
        content:
          'Generally, it is the insurance company of the professional or healthcare center that pays the compensation. All healthcare professionals are required to have professional liability insurance.',
      },
    ],
  },
  {
    title: 'About Our Firm',
    faqs: [
      {
        id: 'q11',
        title: 'Why choose GVC Expertos?',
        content:
          'We are a law firm with roots since 1946, a multidisciplinary firm with solid specialization in medical negligence. We collaborate with medical experts to analyze each case with rigor and professional nobility.',
      },
      {
        id: 'q12',
        title: 'Do you work throughout Spain?',
        content:
          'Yes, we handle cases throughout Spain. We have offices in Murcia and we can manage your case regardless of where you are.',
      },
      {
        id: 'q13',
        title: 'How can I contact you?',
        content:
          'You can call us at 968 241 025, send us an email to contacto@gvcabogados.com or visit our offices at Plaza Fuensanta, 3 - 6ºB, 30008 Murcia. We will attend you personally.',
      },
    ],
  },
]

export default async function PreguntasFrecuentesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isSpanish = locale === 'es'
  const faqCategories = isSpanish ? faqCategoriesEs : faqCategoriesEn
  
  // Flatten FAQs for Schema
  const allFaqs = faqCategories.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      question: faq.title,
      answer: faq.content,
    }))
  )
  
  return (
    <>
      <JsonLdFAQ faqs={allFaqs} />

      {/* Hero */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: isSpanish ? 'Preguntas Frecuentes' : 'FAQ' }]}
            className="mb-6 text-gray-400"
          />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            {isSpanish ? (
              <>
                Preguntas <span className="text-gold">Frecuentes</span>
              </>
            ) : (
              <>
                Frequently <span className="text-gold">Asked Questions</span>
              </>
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {isSpanish
              ? 'Resolvemos las dudas más comunes sobre negligencias médicas, reclamaciones e indemnizaciones. Si no encuentras respuesta a tu pregunta, contáctanos.'
              : 'We answer the most common questions about medical negligence, claims and compensation. If you don\'t find an answer to your question, contact us.'}
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, index) => (
              <div key={index}>
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 pb-3 border-b-2 border-gold">
                  {category.title}
                </h2>
                <Accordion items={category.faqs} allowMultiple />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
