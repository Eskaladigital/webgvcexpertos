import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let _transporter: Transporter | null = null
let _warned = false

function smtpPass() {
  return process.env.SMTP_PASS?.trim() || process.env.SMTP_PASSWORD?.trim() || ''
}

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter
  const host = process.env.SMTP_HOST?.trim() || 'ssl0.ovh.net'
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER?.trim()
  const pass = smtpPass()
  if (!user || !pass) {
    if (!_warned) {
      console.warn('[email] SMTP_USER / SMTP_PASS no configurados; correo omitido')
      _warned = true
    }
    return null
  }
  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  return _transporter
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  try {
    const transporter = getTransporter()
    if (!transporter) {
      return {
        success: false,
        error: 'SMTP no configurado. Añade SMTP_USER y SMTP_PASS (buzón OVH).',
      }
    }

    const from = process.env.SMTP_FROM?.trim() || 'GVC Expertos <contacto@gvcabogados.com>'
    const info = await transporter.sendMail({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    })

    return { success: true, data: { id: info.messageId } }
  } catch (error) {
    console.error('Error en sendEmail:', error)
    return { success: false, error }
  }
}

// Templates de email

export function getContactNotificationTemplate({
  name,
  email,
  phone,
  service,
  message,
}: {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <h1 style="color: #b8860b; margin: 0; font-size: 24px;">GVC Expertos</h1>
      </div>
      
      <div style="padding: 30px 20px; background-color: #f5f5f5;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Nueva solicitud de contacto</h2>
        
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          ${service ? `<p><strong>Servicio:</strong> ${service}</p>` : ''}
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 5px;">
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
      
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>Este email fue enviado automáticamente desde el formulario de contacto de gvcexpertos.es</p>
      </div>
    </body>
    </html>
  `
}

export function getContactConfirmationTemplate({ name }: { name: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <h1 style="color: #b8860b; margin: 0; font-size: 24px;">GVC Expertos</h1>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hemos recibido tu consulta</h2>
        
        <p>Estimado/a ${name},</p>
        
        <p>Gracias por contactar con GVC Expertos. Hemos recibido tu consulta y un abogado especializado se pondrá en contacto contigo en las próximas 24 horas.</p>
        
        <p>Si tu caso es urgente, puedes llamarnos directamente al:</p>
        
        <p style="text-align: center; font-size: 24px; color: #b8860b; font-weight: bold;">
          <a href="tel:+34968241025" style="color: #b8860b; text-decoration: none;">968 241 025</a>
        </p>
        
        <p>Atentamente,<br>El equipo de GVC Expertos</p>
      </div>
      
      <div style="padding: 20px; background-color: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
        <p>GVC Expertos - Abogados Especialistas en Negligencias Médicas</p>
        <p>Plaza Fuensanta, 3 - 6ºB, 30008 Murcia</p>
      </div>
    </body>
    </html>
  `
}
