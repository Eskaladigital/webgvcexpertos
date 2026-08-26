import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Phone, Shield, Award, Users, Clock, TrendingUp, FileText, AlertCircle } from 'lucide-react'
import { services, siteConfig } from '@/config/site'
import { ServiceIcon } from '@/components/ui/Icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Accordion } from '@/components/ui/Accordion'
import { CtaFinal } from '@/components/home'
import { JsonLdService, JsonLdFAQ, JsonLdBreadcrumbs } from '@/components/seo/JsonLd'
import { LocalizedLink } from '@/components/ui/LocalizedLink'
import { getTranslations } from 'next-intl/server'

// Contenido detallado de cada servicio - ESPAÑOL
const serviceContentEs: Record<string, {
  intro: string
  description: string[]
  symptoms: string[]
  faqs: { id: string; title: string; content: string }[]
}> = {
  'errores-quirurgicos': {
    intro: 'Un error quirúrgico se produce cuando la actuación del cirujano o del equipo asistencial se aparta de la lex artis ad hoc. No todo resultado adverso implica negligencia: la valoración pericial es esencial para diferenciar entre complicación y mala praxis.',
    description: [
      'Un error quirúrgico implica una actuación contraria a la lex artis durante el acto operatorio. Para que exista responsabilidad, es necesario que dicho apartamiento sea causa directa del daño sufrido por el paciente. Algunas complicaciones son inherentes al propio acto quirúrgico aun cuando se realice correctamente.',
      'La responsabilidad puede recaer en el cirujano o equipo médico (por ejecución deficiente), el anestesista (errores en evaluación preanestésica, administración de fármacos o monitorización), el centro sanitario (fallos organizativos o incumplimiento de protocolos) o la aseguradora (acción directa conforme al art. 76 LCS).',
      'Si existe sospecha de error quirúrgico, es recomendable recabar de inmediato toda la documentación clínica: historia completa, informes operatorios, registros anestésicos y pruebas complementarias. Una revisión pericial temprana permite identificar omisiones, fallos de técnica y vínculos causales.',
    ],
    symptoms: [
      'Intervención en zona anatómica incorrecta',
      'Retención de instrumentos o materiales quirúrgicos',
      'Lesiones de órganos o nervios atribuibles a técnica inadecuada',
      'Infecciones postquirúrgicas asociadas a fallos de asepsia o ruptura de protocolo',
      'Complicaciones evitables por defectos técnicos o de planificación operatoria',
      'Errores en anestesia: dosificación incorrecta, monitorización insuficiente o mala valoración preoperatoria',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Cuánto tiempo tengo para reclamar un error quirúrgico?',
        content: 'Los plazos varían según la vía: responsabilidad patrimonial sanitaria (1 año), vía civil contractual (5 años), vía civil extracontractual (1 año desde la estabilización de secuelas). Es fundamental consultar cuanto antes para preservar pruebas y no perder plazos.',
      },
      {
        id: '2',
        title: '¿Cómo se diferencia un error de una complicación?',
        content: 'No todo resultado adverso implica negligencia. La diferencia radica en si la actuación médica se ajustó a la lex artis ad hoc. Un perito médico analiza si existió apartamiento de los estándares exigibles y si ese apartamiento causó el daño.',
      },
      {
        id: '3',
        title: '¿Necesito un informe pericial?',
        content: 'Sí, el informe pericial médico es fundamental para establecer si existió apartamiento de la lex artis y la relación de causalidad con el daño. Cada caso se analiza conforme a la documentación clínica, estándares quirúrgicos aplicables y criterios periciales.',
      },
    ],
  },
  'errores-diagnostico': {
    intro: 'Un error de diagnóstico se produce cuando el proceso de valoración clínica se aparta de la lex artis ad hoc. No todo diagnóstico difícil o tardío implica negligencia: es necesario acreditar que, con una actuación diligente, el resultado previsiblemente habría sido distinto.',
    description: [
      'El diagnóstico correcto exige una anamnesis adecuada, una exploración completa, la solicitud razonable de pruebas y su correcta interpretación, así como un seguimiento proporcional a la gravedad del caso. Hay patologías con presentación atípica en las que el error puede ser comprensible aun actuando conforme a la lex artis.',
      'Para que exista responsabilidad por error de diagnóstico no basta con que el diagnóstico haya sido tardío o incorrecto: debe demostrarse que un médico competente, en las mismas circunstancias, habría alcanzado antes el diagnóstico correcto y que ello habría permitido evitar o reducir el daño sufrido.',
      'La valoración pericial se basa en la historia clínica, la cronología de síntomas, las decisiones diagnósticas adoptadas y las guías o protocolos aplicables al momento de los hechos.',
    ],
    symptoms: [
      'Retraso diagnóstico sin justificación aparente en patologías graves',
      'Confusión entre dos enfermedades con manifestaciones claramente diferenciables',
      'Omisión de pruebas diagnósticas básicas recomendadas por guías clínicas',
      'Interpretación manifiestamente errónea de pruebas complementarias',
      'Falta de derivación a un especialista cuando era clínicamente exigible',
      'Altas sucesivas sin diagnóstico claro pese a la persistencia o agravamiento de los síntomas',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Siempre que hay un diagnóstico tardío existe negligencia?',
        content: 'No. La negligencia solo existe cuando el retraso se debe a una actuación contraria a la lex artis y ese retraso ha tenido relevancia en el pronóstico o en las opciones terapéuticas. En algunas enfermedades de evolución silenciosa o presentación atípica, el diagnóstico tardío puede ser inevitable incluso con buena praxis.',
      },
      {
        id: '2',
        title: '¿Cómo se acredita un error de diagnóstico?',
        content: 'Mediante un informe pericial que compare la actuación seguida con la que habría adoptado un médico competente en las mismas circunstancias, valorando si se solicitaron las pruebas adecuadas, si se interpretaron correctamente y si se realizó el seguimiento oportuno.',
      },
      {
        id: '3',
        title: '¿Qué documentación es importante conservar?',
        content: 'Informes de urgencias y consultas, pruebas diagnósticas, informes de alta y cualquier documento que refleje la cronología de síntomas y visitas médicas. Esta documentación permite al perito reconstruir el proceso diagnóstico y valorar si se ajustó a la lex artis.',
      },
    ],
  },
  'negligencia-hospitalaria': {
    intro: 'Hablamos de negligencia hospitalaria cuando la organización, los medios o la actuación del personal de un centro se apartan de los estándares exigibles y ello causa un daño al paciente. No todo evento adverso hospitalario implica mala praxis.',
    description: [
      'Los hospitales, tanto públicos como privados, deben garantizar una asistencia segura y de calidad, con recursos humanos y materiales suficientes y protocolos actualizados. La responsabilidad puede derivar tanto de errores individuales como de fallos estructurales u organizativos.',
      'Las infecciones nosocomiales, las caídas o las úlceras por presión no son automáticamente negligencias: es necesario analizar si se cumplieron las medidas de prevención, higiene, supervisión y registro exigibles según la lex artis y los protocolos del centro.',
      'En el ámbito público, la reclamación suele articularse como responsabilidad patrimonial de la Administración; en el privado, a través de acciones civiles frente al centro, los profesionales implicados y, en su caso, sus aseguradoras.',
    ],
    symptoms: [
      'Infecciones nosocomiales con sospecha de fallos en higiene, profilaxis o aislamiento',
      'Caídas de pacientes en planta por falta de barandillas, timbres o vigilancia adecuada',
      'Úlceras por presión en pacientes encamados sin registro de cambios posturales ni medidas preventivas',
      'Errores en la administración de medicación por fallos en los circuitos internos del hospital',
      'Falta de personal o de medios materiales que compromete la seguridad asistencial',
      'Retrasos injustificados en la atención de urgencias o en pruebas críticas',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Quién responde en un caso de negligencia hospitalaria?',
        content: 'Depende del tipo de centro y del origen del fallo. Puede responder el profesional individual, el propio hospital por deficiencias organizativas y, en el caso de centros públicos, la Administración sanitaria a través de la responsabilidad patrimonial.',
      },
      {
        id: '2',
        title: '¿Todas las infecciones hospitalarias son reclamables?',
        content: 'No. Solo son reclamables aquellas en las que se demuestra un incumplimiento de las medidas de prevención o de los protocolos de control de infecciones. Muchas infecciones son un riesgo inherente a determinadas patologías y procedimientos, incluso con buena praxis.',
      },
      {
        id: '3',
        title: '¿Qué pasos debo seguir si sospecho negligencia en un hospital?',
        content: 'Solicitar la historia clínica completa, recopilar informes y hojas de evolución, y consultar con un perito médico y un abogado especializado para valorar si existió apartamiento de la lex artis y si procede una reclamación por la vía adecuada.',
      },
    ],
  },
  'negligencia-obstetrica': {
    intro: 'La obstetricia es un área de alto riesgo en la que las decisiones médicas deben ajustarse estrictamente a la lex artis para proteger a la madre y al bebé. No todo resultado desfavorable en el parto implica negligencia.',
    description: [
      'El control del embarazo y del parto exige una monitorización adecuada del bienestar fetal y materno, una correcta interpretación de los registros y una respuesta proporcional ante los signos de sufrimiento. La lex artis se concreta en protocolos de monitorización, inducción, uso de instrumental y decisión de cesárea.',
      'La posible negligencia se analiza caso por caso: retrasos injustificados en indicar una cesárea urgente, uso inadecuado de fórceps o ventosa, falta de actuación ante signos de hipoxia fetal o defectos en la atención a la madre durante el posparto.',
      'Las secuelas pueden afectar al recién nacido (parálisis cerebral infantil, lesiones del plexo braquial, hipoxia neonatal) o a la madre (desgarros graves no reparados, hemorragias, secuelas funcionales), pero solo serán indemnizables cuando se acredite un apartamiento de la lex artis y un nexo causal claro.',
    ],
    symptoms: [
      'Registro cardiotocográfico con signos compatibles con sufrimiento fetal mantenido sin respuesta adecuada',
      'Retraso injustificado en la realización de cesárea de urgencia',
      'Uso inadecuado de fórceps o ventosa con lesiones evidentes en el recién nacido',
      'Ausencia de monitorización adecuada durante el trabajo de parto',
      'Lesiones del plexo braquial compatibles con maniobras incorrectas ante una distocia de hombros',
      'Desgarros graves o complicaciones maternas sin adecuada valoración ni tratamiento',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Cómo se valora una posible negligencia en el parto?',
        content: 'Mediante un estudio detallado de la historia obstétrica, los registros de monitorización fetal, los tiempos de actuación y las decisiones adoptadas. El perito analiza si se siguieron los protocolos y si hubo retrasos o maniobras inadecuadas que expliquen el daño.',
      },
      {
        id: '2',
        title: '¿Existen plazos especiales para reclamar por daños al recién nacido?',
        content: 'En general, los plazos de prescripción por daños a menores comienzan a computar desde su mayoría de edad, aunque es recomendable iniciar el estudio pericial cuanto antes para preservar la documentación y las pruebas.',
      },
      {
        id: '3',
        title: '¿La madre puede reclamar por sus propias secuelas?',
        content: 'Sí. La madre puede reclamar de forma independiente por los daños físicos y psicológicos sufridos durante el parto o el posparto, siempre que se acredite que derivan de una actuación contraria a la lex artis.',
      },
    ],
  },
  'errores-medicacion': {
    intro: 'Los errores de medicación son desviaciones en el circuito del medicamento (prescripción, dispensación o administración) que se apartan de la lex artis. No toda reacción adversa supone un error: algunos efectos secundarios son riesgos conocidos y aceptados.',
    description: [
      'Puede haber error en la prescripción (fármaco inadecuado, dosis o pauta incorrecta, contraindicaciones no valoradas), en la dispensación (confusión de envases o principios activos) o en la administración (dosis, vía o paciente equivocado).',
      'Para que exista responsabilidad, debe demostrarse que se incumplieron las obligaciones de verificación, registro o supervisión propias de cada fase y que ese incumplimiento fue causa directa del daño sufrido por el paciente.',
      'La valoración pericial tiene en cuenta la medicación previa, las comorbilidades, las advertencias de ficha técnica y las guías de práctica clínica, así como los protocolos internos de farmacia y enfermería.',
    ],
    symptoms: [
      'Administración de dosis claramente superiores o inferiores a las recomendadas',
      'Prescripción de medicamentos contraindicados por alergias conocidas o interacciones graves',
      'Reacciones adversas graves sin que conste valoración previa del riesgo-beneficio',
      'Confusión entre medicamentos de nombre o aspecto similar',
      'Errores en la vía de administración (oral, intravenosa, epidural, etc.)',
      'Ausencia de seguimiento o registro ante la aparición de efectos adversos significativos',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Qué debo hacer si sospecho un error de medicación?',
        content: 'Conserva el medicamento y su envase, solicita tu historia clínica y los registros de administración, y consulta con un especialista en responsabilidad sanitaria para valorar si hubo incumplimiento de protocolos y relación causal con el daño.',
      },
      {
        id: '2',
        title: '¿Puede ser responsable la farmacia si me da un medicamento equivocado?',
        content: 'Sí, la oficina de farmacia puede responder si dispensa un fármaco distinto al prescrito o incumple sus deberes de verificación y advertencia. En esos casos se valora la responsabilidad del farmacéutico y, en su caso, de su aseguradora.',
      },
      {
        id: '3',
        title: '¿Toda reacción adversa implica una mala praxis?',
        content: 'No. Muchos efectos adversos forman parte de los riesgos conocidos del medicamento. Solo hay negligencia cuando se acredita un error evitable en la prescripción, dispensación o administración que se aparta de la lex artis y guarda relación causal con el daño.',
      },
    ],
  },
  'consentimiento-informado': {
    intro: 'El paciente tiene derecho a recibir información comprensible y suficiente para decidir sobre su tratamiento. La falta o el defecto de consentimiento informado puede generar responsabilidad, especialmente por vulneración del derecho a la autodeterminación.',
    description: [
      'El consentimiento informado exige explicar el diagnóstico, la finalidad del tratamiento, los riesgos típicos y relevantes, las alternativas razonables y las consecuencias de no tratarse, de forma adecuada al paciente y con tiempo para que pueda preguntar y decidir.',
      'La responsabilidad no depende solo del resultado de la intervención, sino de si el paciente tuvo realmente la oportunidad de aceptar o rechazar el procedimiento conociendo los riesgos. Incluso cuando la técnica se ejecuta correctamente, puede existir daño moral por pérdida de oportunidad de decidir.',
      'Este derecho cobra especial relevancia en intervenciones quirúrgicas, tratamientos invasivos o procedimientos con riesgos significativos, donde suele exigirse consentimiento escrito además del verbal.',
    ],
    symptoms: [
      'Intervención sin consentimiento del paciente',
      'Información incompleta sobre riesgos',
      'Firma de documentos sin explicación previa',
      'No informar de alternativas de tratamiento',
      'Consentimiento genérico sin especificar riesgos',
      'No respetar la negativa del paciente',
    ],
    faqs: [
      {
        id: '1',
        title: '¿Puedo reclamar si firmé el consentimiento pero no me explicaron los riesgos?',
        content: 'Sí. La firma por sí sola no basta: el consentimiento debe ser informado. Si no se explicaron los riesgos relevantes o no se permitió resolver dudas, puede apreciarse un defecto de información con posibles consecuencias indemnizatorias.',
      },
      {
        id: '2',
        title: '¿Qué pasa si sufrí una complicación que no me advirtieron?',
        content: 'Si la complicación era un riesgo típico y previsible que debió comunicarse y no se hizo, puede existir pérdida de oportunidad de haber elegido otra alternativa o de haber rechazado el procedimiento, lo que puede dar lugar a responsabilidad aunque la técnica fuera correcta.',
      },
      {
        id: '3',
        title: '¿El consentimiento verbal es válido?',
        content: 'En general, para intervenciones quirúrgicas y procedimientos invasivos se requiere consentimiento escrito. El consentimiento verbal puede ser válido para tratamientos menores, pero siempre debe existir información previa.',
      },
    ],
  },
}

// Contenido detallado de cada servicio - INGLÉS
const serviceContentEn: Record<string, {
  intro: string
  description: string[]
  symptoms: string[]
  faqs: { id: string; title: string; content: string }[]
}> = {
  'errores-quirurgicos': {
    intro: 'A surgical error occurs when the actions of the surgeon or medical team deviate from the lex artis ad hoc. Not every adverse outcome implies negligence: expert assessment is essential to differentiate between complication and malpractice.',
    description: [
      'A surgical error implies an action contrary to the lex artis during the surgical procedure. For liability to exist, the deviation must be a direct cause of the harm suffered by the patient. Some complications are inherent to the surgical procedure even when performed correctly.',
      'Liability may fall on the surgeon or medical team (deficient execution), the anesthesiologist (errors in pre-anesthetic evaluation, drug administration or monitoring), the healthcare facility (organizational failures or protocol breaches), or the insurer (direct action under art. 76 LCS).',
      'If a surgical error is suspected, it is advisable to immediately gather all clinical documentation: complete medical history, operative reports, anesthetic records and complementary tests. Early expert review helps identify omissions, technical failures and causal links.',
    ],
    symptoms: [
      'Intervention in incorrect anatomical area',
      'Retention of surgical instruments or materials',
      'Organ or nerve injuries attributable to inadequate technique',
      'Post-surgical infections associated with asepsis failures or protocol breach',
      'Avoidable complications due to technical or operative planning defects',
      'Anesthesia errors: incorrect dosage, insufficient monitoring or poor preoperative assessment',
    ],
    faqs: [
      {
        id: '1',
        title: 'How long do I have to claim a surgical error?',
        content: 'Time limits vary by legal avenue: healthcare liability (1 year), contractual civil action (5 years), non-contractual civil action (1 year from stabilization of sequelae). It is essential to consult as soon as possible to preserve evidence and meet deadlines.',
      },
      {
        id: '2',
        title: 'How is an error differentiated from a complication?',
        content: 'Not every adverse outcome implies negligence. The difference lies in whether the medical action conformed to the lex artis ad hoc. A medical expert analyzes whether there was deviation from required standards and whether that deviation caused the harm.',
      },
      {
        id: '3',
        title: 'Do I need an expert report?',
        content: 'Yes, the medical expert report is essential to establish whether there was deviation from the lex artis and the causal relationship with the harm. Each case is analyzed according to clinical documentation, applicable surgical standards and expert causation criteria.',
      },
    ],
  },
  'errores-diagnostico': {
    intro: 'A diagnostic error occurs when the clinical assessment process deviates from the lex artis ad hoc. Not every difficult or late diagnosis implies negligence: it must be shown that, with diligent action, the outcome would likely have been different.',
    description: [
      'Correct diagnosis requires adequate history taking, thorough physical examination, reasonable ordering of tests and correct interpretation of results, as well as appropriate follow-up. Some diseases have atypical presentations where error may be understandable even when acting according to lex artis.',
      'For liability to exist, it is not enough that the diagnosis was late or incorrect: it must be proven that a competent doctor, under the same circumstances, would have reached the correct diagnosis earlier and that this would have allowed the damage suffered to be avoided or reduced.',
      'Expert assessment is based on the medical records, symptom chronology, diagnostic decisions taken and the guidelines or protocols applicable at the time of the events.',
    ],
    symptoms: [
      'Late diagnosis of cancer or other serious diseases',
      'Confusion of one disease with another',
      'Lack of necessary diagnostic tests',
      'Incorrect interpretation of medical tests',
      'Failure to refer to appropriate specialist',
      'Premature discharge without correct diagnosis',
    ],
    faqs: [
      {
        id: '1',
        title: 'Does every late diagnosis amount to negligence?',
        content: 'No. Negligence exists only when the delay results from action contrary to the lex artis and that delay has relevance for the prognosis or treatment options. In some silent or atypical diseases, delayed diagnosis may be unavoidable even with proper practice.',
      },
      {
        id: '2',
        title: 'How is a diagnostic error proven?',
        content: 'Through an expert report comparing the conduct followed with that of a competent doctor in the same circumstances, assessing whether appropriate tests were requested, correctly interpreted and followed up.',
      },
      {
        id: '3',
        title: 'What documentation is important to keep?',
        content: 'Emergency and outpatient reports, test results, discharge summaries and any document reflecting the chronology of symptoms and medical visits. This documentation enables the expert to reconstruct the diagnostic process and assess whether it conformed to the lex artis.',
      },
    ],
  },
  'negligencia-hospitalaria': {
    intro: 'Hospital negligence refers to failures in organization, resources or staff actions in a facility that deviate from required standards and cause harm to the patient. Not every hospital adverse event implies malpractice.',
    description: [
      'Public and private hospitals must guarantee safe, quality care, with sufficient human and material resources and updated protocols. Liability may arise from individual errors or from structural and organizational failures.',
      'Nosocomial infections, falls or pressure ulcers are not automatically negligent: it is necessary to analyze whether prevention, hygiene, supervision and recording measures required by lex artis and internal protocols were met.',
      'In the public sector, claims are usually brought as patrimonial liability of the Administration; in the private sector, through civil actions against the facility, the professionals involved and, where appropriate, their insurers.',
    ],
    symptoms: [
      'Nosocomial (hospital-acquired) infections',
      'Patient falls due to lack of surveillance',
      'Pressure ulcers in bedridden patients',
      'Errors in medication administration',
      'Lack of adequate personnel or means',
      'Delay in emergency care',
    ],
    faqs: [
      {
        id: '1',
        title: 'Who is liable in a case of hospital negligence?',
        content: 'Depending on the type of facility and the source of the failure, liability may rest with the individual professional, the hospital for organizational deficiencies and, in public centers, the health Administration through patrimonial liability.',
      },
      {
        id: '2',
        title: 'Are all hospital-acquired infections claimable?',
        content: 'No. Only those in which a breach of prevention measures or infection control protocols can be demonstrated are claimable. Many infections are inherent risks of certain pathologies and procedures, even with proper practice.',
      },
      {
        id: '3',
        title: 'What steps should I take if I suspect hospital negligence?',
        content: 'Request the complete medical record, gather reports and progress notes, and consult a medical expert and a specialized lawyer to assess whether there was deviation from lex artis and the appropriate legal route for a claim.',
      },
    ],
  },
  'negligencia-obstetrica': {
    intro: 'Obstetrics is a high-risk area where medical decisions must strictly comply with the lex artis to protect both mother and baby. Not every unfavorable birth outcome implies negligence.',
    description: [
      'Pregnancy and childbirth require adequate monitoring of fetal and maternal well-being, correct interpretation of tracings and proportional response to signs of distress. Lex artis is reflected in protocols for monitoring, induction, instrumental delivery and cesarean section decisions.',
      'Possible negligence is assessed case by case: unjustified delays in indicating emergency cesarean section, inappropriate use of forceps or vacuum, failure to act on signs of fetal hypoxia or deficiencies in postpartum care for the mother.',
      'Sequelae may affect the newborn (cerebral palsy, brachial plexus injuries, neonatal hypoxia) or the mother (severe unrepaired tears, hemorrhage, functional sequelae), but compensation requires evidence of deviation from lex artis and a clear causal link.',
    ],
    symptoms: [
      'Cerebral palsy due to fetal distress',
      'Injuries from improper use of forceps or vacuum',
      'Delay in performing emergency cesarean',
      'Lack of monitoring during childbirth',
      'Brachial plexus injuries',
      'Severe tears not properly repaired',
    ],
    faqs: [
      {
        id: '1',
        title: 'How is possible negligence in childbirth assessed?',
        content: 'By a detailed review of the obstetric history, fetal monitoring records, timing of interventions and decisions taken. The expert analyzes whether protocols were followed and whether there were delays or inappropriate maneuvers explaining the damage.',
      },
      {
        id: '2',
        title: 'Are there special time limits for claims involving newborns?',
        content: 'In many systems, limitation periods for damage to minors start from their reaching the age of majority, but it is advisable to begin expert assessment as early as possible to preserve documentation and evidence.',
      },
      {
        id: '3',
        title: 'Can the mother claim for her own sequelae?',
        content: 'Yes. The mother may claim independently for physical and psychological damage suffered during childbirth or postpartum, provided it is shown to result from conduct contrary to lex artis.',
      },
    ],
  },
  'errores-medicacion': {
    intro: 'Medication errors are deviations in the drug circuit (prescription, dispensing or administration) that depart from lex artis. Not every adverse reaction implies error: some side effects are known and accepted risks.',
    description: [
      'Errors may occur in prescription (inappropriate drug, incorrect dose or regimen, unassessed contraindications), dispensing (confusion of packaging or active ingredients) or administration (wrong dose, route or patient).',
      'For liability to arise, it must be shown that verification, recording or supervision duties in each phase were breached and that this breach directly caused the harm suffered by the patient.',
      'Expert assessment considers prior medication, comorbidities, product information warnings and clinical guidelines, as well as internal pharmacy and nursing protocols.',
    ],
    symptoms: [
      'Administration of incorrect doses',
      'Medications contraindicated with other treatments',
      'Allergic reactions due to lack of verification',
      'Confusion of similar medications',
      'Errors in the route of administration',
      'Lack of monitoring of side effects',
    ],
    faqs: [
      {
        id: '1',
        title: 'What should I do if I suspect a medication error?',
        content: 'Keep the medication and its packaging, request your medical record and administration charts, and consult a specialist in healthcare liability to assess whether there were protocol breaches and a causal link to the harm.',
      },
      {
        id: '2',
        title: 'Can the pharmacy be liable if it gives me the wrong medication?',
        content: 'Yes. A community pharmacy may be liable if it dispenses a different drug than prescribed or fails in its verification and warning duties. In such cases the pharmacist and, where applicable, their insurer may be held responsible.',
      },
      {
        id: '3',
        title: 'Does every adverse reaction imply malpractice?',
        content: 'No. Many adverse effects are part of the known risk profile of the drug. Negligence exists only when an avoidable error in prescription, dispensing or administration, departing from lex artis, can be shown to have caused the harm.',
      },
    ],
  },
  'consentimiento-informado': {
    intro: 'Patients have the right to receive clear and sufficient information to decide about their treatment. Lack of, or defects in, informed consent may give rise to liability, particularly for violation of the right to self-determination.',
    description: [
      'Informed consent requires explaining the diagnosis, purpose of treatment, typical and relevant risks, reasonable alternatives and consequences of not being treated, in terms the patient can understand and with time to ask questions and decide.',
      'Liability does not depend solely on the outcome of the intervention, but on whether the patient genuinely had the opportunity to accept or refuse the procedure knowing the risks. Even where technique is correct, moral damage may exist due to loss of opportunity to decide.',
      'This right is especially important in surgical interventions, invasive treatments or procedures with significant risks, where written consent is usually required in addition to verbal explanations.',
    ],
    symptoms: [
      'Intervention without patient consent',
      'Incomplete information about risks',
      'Signing documents without prior explanation',
      'Failure to inform of treatment alternatives',
      'Generic consent without specifying risks',
      'Not respecting the patient\'s refusal',
    ],
    faqs: [
      {
        id: '1',
        title: 'Can I claim if I signed consent but the risks were not explained?',
        content: 'Yes. Signature alone is not enough: consent must be informed. If relevant risks were not explained or there was no opportunity to ask questions, a defect in information may be found with possible compensatory consequences.',
      },
      {
        id: '2',
        title: 'What happens if I suffered a complication they didn\'t warn me about?',
        content: 'If the complication was a typical and foreseeable risk that should have been communicated and was not, there may be loss of opportunity to choose another option or refuse the procedure, which can give rise to liability even if the technique was correct.',
      },
      {
        id: '3',
        title: 'Is verbal consent valid?',
        content: 'In general, written consent is required for surgical interventions and invasive procedures. Verbal consent may be valid for minor treatments, but prior information must always exist.',
      },
    ],
  },
}

// Generar rutas estáticas
export function generateStaticParams() {
  return services.flatMap((service) => [
    { locale: 'es', servicio: service.slug },
    { locale: 'en', servicio: service.slug },
  ])
}

// Generar metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string; locale: string }>
}): Promise<Metadata> {
  const { servicio, locale } = await params
  const service = services.find((s) => s.slug === servicio)
  const isSpanish = locale === 'es'
  const tServices = await getTranslations({ locale, namespace: 'services' })
  
  if (!service) {
    return {
      title: isSpanish ? 'Servicio no encontrado' : 'Service not found',
    }
  }

  // Mapeo de slugs para traducciones
  const serviceSlugMap: Record<string, string> = {
    'errores-quirurgicos': 'surgical-errors',
    'errores-diagnostico': 'diagnostic-errors',
    'negligencia-hospitalaria': 'hospital-negligence',
    'negligencia-obstetrica': 'obstetric-negligence',
    'errores-medicacion': 'medication-errors',
    'consentimiento-informado': 'informed-consent',
  }
  
  // Las traducciones siempre usan el slug inglés como clave
  const translationKey = serviceSlugMap[service.slug] || service.slug
  const serviceTitle = tServices(`${translationKey}.title`)
  const serviceDescription = tServices(`${translationKey}.description`)

  return {
    title: isSpanish
      ? `${serviceTitle} | Abogados Especialistas`
      : `${serviceTitle} | Specialist Lawyers`,
    description: isSpanish
      ? `Abogados especializados en ${serviceTitle.toLowerCase()}. ${serviceDescription} Bufete desde 1946.`
      : `Lawyers specialized in ${serviceTitle.toLowerCase()}. ${serviceDescription} Law firm since 1946.`,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/negligencias-medicas/${service.slug}`,
      languages: {
        'es-ES': `${siteConfig.url}/es/negligencias-medicas/${service.slug}`,
        'en-US': `${siteConfig.url}/en/negligencias-medicas/${service.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      url: `${siteConfig.url}/${locale}/negligencias-medicas/${service.slug}`,
      title: isSpanish
        ? `${serviceTitle} | Abogados Especialistas`
        : `${serviceTitle} | Specialist Lawyers`,
      description: isSpanish
        ? `Abogados especializados en ${serviceTitle.toLowerCase()}. ${serviceDescription}`
        : `Specialized lawyers in ${serviceTitle.toLowerCase()}. ${serviceDescription}`,
      siteName: siteConfig.name,
      images: [{
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: serviceTitle,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isSpanish
        ? `${serviceTitle} | Abogados Especialistas`
        : `${serviceTitle} | Specialist Lawyers`,
      description: isSpanish
        ? `Abogados especializados en ${serviceTitle.toLowerCase()}.`
        : `Specialized lawyers in ${serviceTitle.toLowerCase()}.`,
      images: [`${siteConfig.url}/images/og-image.jpg`],
    },
  }
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ servicio: string; locale: string }>
}) {
  const { servicio, locale } = await params
  const service = services.find((s) => s.slug === servicio)
  const isSpanish = locale === 'es'
  const t = await getTranslations({ locale })
  const tServices = await getTranslations({ locale, namespace: 'services' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  
  if (!service) {
    notFound()
  }

  const serviceContent = isSpanish ? serviceContentEs : serviceContentEn
  const content = serviceContent[servicio]
  const otherServices = services.filter((s) => s.slug !== servicio).slice(0, 3)
  
  // Mapeo de slugs en español a slugs en inglés para traducciones
  const serviceSlugMap: Record<string, string> = {
    'errores-quirurgicos': 'surgical-errors',
    'errores-diagnostico': 'diagnostic-errors',
    'negligencia-hospitalaria': 'hospital-negligence',
    'negligencia-obstetrica': 'obstetric-negligence',
    'errores-medicacion': 'medication-errors',
    'consentimiento-informado': 'informed-consent',
  }
  
  // Obtener título y descripción traducidos del servicio (las traducciones siempre usan slug inglés)
  const translationKey = serviceSlugMap[service.slug] || service.slug
  const serviceTitle = tServices(`${translationKey}.title`)
  const serviceDescription = tServices(`${translationKey}.description`)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: serviceTitle,
            description: serviceDescription,
            url: `${siteConfig.url}/${locale}/negligencias-medicas/${service.slug}`,
            inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
            provider: {
              '@type': 'LegalService',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            areaServed: {
              '@type': 'Country',
              name: locale === 'es' ? 'España' : 'Spain',
            },
            serviceType: 'Legal Service',
            category: locale === 'es' ? 'Negligencias Médicas' : 'Medical Negligence',
          })
        }}
      />
      <JsonLdBreadcrumbs
        items={[
          { name: isSpanish ? 'Inicio' : 'Home', url: siteConfig.url },
          { 
            name: isSpanish ? 'Negligencias Médicas' : 'Medical Negligence', 
            url: `${siteConfig.url}/${locale}/negligencias-medicas` 
          },
          { 
            name: serviceTitle, 
            url: `${siteConfig.url}/${locale}/negligencias-medicas/${service.slug}` 
          },
        ]}
      />
      {content?.faqs && (
        <JsonLdFAQ
          faqs={content.faqs.map((f) => ({
            question: f.title,
            answer: f.content,
          }))}
        />
      )}

      {/* Hero con Imagen */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/abogados_negligencias_medicas_negligencia_2.jpg"
            alt={serviceTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/90 to-charcoal/85" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10">
          <Breadcrumbs
            items={[
              { 
                label: tNav('medical-negligence'), 
                href: `/${locale}${isSpanish ? '/negligencias-medicas' : '/medical-negligence'}` 
              },
              { label: serviceTitle },
            ]}
            className="mb-6 text-gray-400"
          />
          
          <div className="flex items-start gap-8 mb-8">
            <div className="hidden md:block text-gold bg-gold/10 p-5 rounded-lg backdrop-blur-sm">
              <ServiceIcon name={service.icon} className="w-16 h-16" />
            </div>
            <div className="flex-1">
              <div className="inline-block bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-4">
                <span className="text-gold text-sm font-semibold uppercase tracking-wider">
                  {isSpanish ? 'Especialistas en el Caso' : 'Case Specialists'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                {serviceTitle}
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl leading-relaxed">
                {content?.intro || serviceDescription}
              </p>
            </div>
          </div>

          {/* Credenciales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-lg">
              <Clock className="w-8 h-8 text-gold mb-2" />
              <div className="text-2xl font-serif font-bold text-white">1946</div>
              <div className="text-sm text-gray-300">{isSpanish ? 'Desde' : 'Since'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-lg">
              <Users className="w-8 h-8 text-gold mb-2" />
              <div className="text-2xl font-serif font-bold text-white">{isSpanish ? 'Rigor' : 'Rigor'}</div>
              <div className="text-sm text-gray-300">{isSpanish ? 'Profesional' : 'Professional'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-lg">
              <Award className="w-8 h-8 text-gold mb-2" />
              <div className="text-2xl font-serif font-bold text-white">{isSpanish ? 'Nobleza' : 'Nobility'}</div>
              <div className="text-sm text-gray-300">{isSpanish ? 'En el servicio' : 'In service'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="prose prose-lg max-w-none mb-12">
                {content?.description.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Symptoms/Cases */}
              {content?.symptoms && (
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                    {isSpanish ? 'Casos que atendemos' : 'Cases we handle'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.symptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-cream p-4 rounded-sm"
                      >
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-charcoal">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {content?.faqs && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                    {isSpanish ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                  </h2>
                  <Accordion items={content.faqs} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* CTA Card */}
              <div className="bg-charcoal p-8 rounded-sm mb-8 sticky top-24">
                <h3 className="text-xl font-serif font-bold text-white mb-4">
                  {isSpanish ? '¿Necesitas ayuda?' : 'Need help?'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {isSpanish
                    ? 'Te escuchamos y analizamos tu situación con rigor y honestidad.'
                    : 'We listen and analyze your situation with rigor and honesty.'}
                </p>
                <LocalizedLink href="/contacto" className="btn-primary w-full text-center mb-4">
                  {isSpanish ? 'Háblanos de Tu Caso' : 'Tell Us About Your Case'}
                </LocalizedLink>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center justify-center gap-2 text-gold hover:text-gold-light transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">{siteConfig.contact.phone}</span>
                </a>
              </div>

              {/* Other Services */}
              <div className="bg-cream p-6 rounded-sm">
                <h4 className="text-lg font-serif font-semibold text-charcoal mb-4">
                  {isSpanish ? 'Otros servicios' : 'Other services'}
                </h4>
                <div className="space-y-3">
                  {otherServices.map((s) => (
                    <LocalizedLink
                      key={s.slug}
                      href={`/negligencias-medicas/${s.slug}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-gold transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>{tServices(`${serviceSlugMap[s.slug] || s.slug}.title`)}</span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              {isSpanish ? 'Ventajas Competitivas' : 'Competitive Advantages'}
            </span>
            <h2 className="text-4xl font-serif font-bold text-charcoal mt-3 mb-6">
              {isSpanish ? '¿Por Qué Elegirnos para Tu Caso?' : 'Why Choose Us for Your Case?'}
            </h2>
            <p className="text-gray-600 text-lg">
              {isSpanish
                ? `Somos especialistas en ${serviceTitle.toLowerCase()} con un equipo multidisciplinar de abogados y peritos médicos.`
                : `We are specialists in ${serviceTitle.toLowerCase()} with a multidisciplinary team of lawyers and medical experts.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trayectoria */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <Award className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Trayectoria desde 1946' : 'Track Record Since 1946'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'Un bufete con historia y experiencia acumulada en el análisis y defensa de casos de negligencias médicas.'
                  : 'A law firm with history and accumulated experience in analyzing and defending medical negligence cases.'}
              </p>
            </div>

            {/* Equipo */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <Users className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Colaboración con Peritos' : 'Expert Collaboration'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'Trabajamos con peritos médicos especializados para analizar cada caso con rigor profesional.'
                  : 'We work with specialized medical experts to analyze each case with professional rigor.'}
              </p>
            </div>

            {/* Honestidad */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <TrendingUp className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Valoración Honesta' : 'Honest Assessment'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'Te orientamos con transparencia sobre la viabilidad de tu caso y las opciones disponibles.'
                  : 'We guide you transparently about the viability of your case and the available options.'}
              </p>
            </div>

            {/* Te Escuchamos */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <Shield className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Te Escuchamos' : 'We Listen to You'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'Analizamos tu caso con rigor. Te explicamos con claridad tu situación y las posibilidades.'
                  : 'We analyze your case with no obligation. We clearly explain your situation and possibilities.'}
              </p>
            </div>

            {/* Acompañamiento */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <Clock className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Acompañamiento' : 'Support'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'Te acompañamos durante todo el proceso, resolviendo tus dudas y manteniéndote informado.'
                  : 'We accompany you throughout the process, answering your questions and keeping you informed.'}
              </p>
            </div>

            {/* Nobleza */}
            <div className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <FileText className="w-8 h-8 text-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">
                {isSpanish ? 'Nobleza Profesional' : 'Professional Nobility'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {isSpanish
                  ? 'El león, símbolo de nuestro bufete, representa nuestra forma de trabajar: con nobleza, rigor y honra.'
                  : 'The lion, symbol of our firm, represents our way of working: with nobility, rigor and honor.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alerta Importante */}
      <section className="py-12 bg-gold/10 border-y border-gold/20">
        <div className="container-custom">
          <div className="flex items-start gap-6 max-w-5xl mx-auto">
            <div className="hidden md:block">
              <AlertCircle className="w-12 h-12 text-gold" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">
                ⏰ {isSpanish ? 'El Tiempo es Fundamental' : 'Time is Essential'}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {isSpanish
                  ? 'Los plazos para reclamar una negligencia médica son limitados. Es crucial actuar con rapidez para preservar las pruebas y garantizar tus derechos.'
                  : 'Deadlines for claiming medical negligence are limited. It is crucial to act quickly to preserve evidence and guarantee your rights.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <LocalizedLink href="/contacto" className="btn-primary inline-flex items-center justify-center">
                  {isSpanish ? 'Cuéntanos Tu Caso' : 'Tell Us Your Case'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </LocalizedLink>
                <a 
                  href={siteConfig.contact.phoneHref}
                  className="btn-outline inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}

