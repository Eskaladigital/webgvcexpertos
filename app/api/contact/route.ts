import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { 
  sendEmail, 
  getContactNotificationTemplate, 
  getContactConfirmationTemplate 
} from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Mensaje demasiado corto'),
  privacy: z.boolean().refine((val) => val === true, 'Debes aceptar la política de privacidad'),
  contact_type: z.enum(['particular', 'professional']).optional(),
  company: z.string().optional(),
  referral_source: z.string().optional(),
  locale: z.string().optional(),
  gdpr_consent: z.boolean().optional(),
  source_url: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Buscar service_id si se proporcionó nombre de servicio
    let serviceId = null
    let serviceName = validatedData.service
    if (validatedData.service) {
      const { data: service } = await supabase
        .from('services')
        .select('id, title')
        .eq('slug', validatedData.service)
        .single()
      
      if (service) {
        serviceId = service.id
        serviceName = service.title
      }
    }

    // Guardar en Supabase
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        service_id: serviceId,
        message: validatedData.message,
        source_url: validatedData.source_url || null,
        utm_source: validatedData.utm_source || null,
        utm_medium: validatedData.utm_medium || null,
        utm_campaign: validatedData.utm_campaign || null,
        contact_type: validatedData.contact_type || 'particular',
        company: validatedData.contact_type === 'professional' ? validatedData.company || null : null,
        referral_source: validatedData.referral_source || null,
        locale: validatedData.locale || 'es',
        gdpr_consent: validatedData.gdpr_consent ?? validatedData.privacy,
      })
      .select()
      .single()

    if (error) {
      console.error('Error guardando contacto:', error)
      throw error
    }

    try {
      const notificationEmail = process.env.SMTP_TO || process.env.EMAIL_TO || 'contacto@gvcabogados.com'
      await sendEmail({
        to: notificationEmail,
        subject: `Nueva consulta de ${validatedData.name}`,
        html: getContactNotificationTemplate({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          service: serviceName,
          message: validatedData.message,
          contactType: validatedData.contact_type,
          company: validatedData.company,
          referralSource: validatedData.referral_source,
        }),
        replyTo: validatedData.email,
      })

      await sendEmail({
        to: validatedData.email,
        subject: 'Hemos recibido tu consulta — GVC Expertos',
        html: getContactConfirmationTemplate({
          name: validatedData.name,
          message: validatedData.message,
        }),
      })
    } catch (mailError) {
      console.error('Contact email error:', mailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error en /api/contact:', error)
    return NextResponse.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
