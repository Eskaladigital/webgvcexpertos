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
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function referralLabel(value: string) {
  const map: Record<string, string> = {
    google: 'Búsqueda en Google',
    social: 'Redes sociales',
    referral: 'Recomendación',
    other: 'Otro',
  }
  return map[value] || value
}

const C = {
  page: '#f7f4ea',
  paper: '#ffffff',
  ink: '#1a1a1a',
  muted: '#6b675c',
  line: '#e4dcc8',
  header: '#1a1a1a',
  headerFg: '#b8860b',
  accent: '#b8860b',
  box: '#f5f0e0',
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GVC Expertos</title></head>
<body style="margin:0;padding:0;background-color:${C.page};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${C.paper};border:1px solid ${C.line};">
<tr><td style="background-color:${C.header};padding:24px 32px;text-align:center;">
<span style="font-size:20px;font-weight:bold;color:${C.headerFg};letter-spacing:2px;text-transform:uppercase;">GVC Expertos</span>
<br><span style="font-size:11px;color:#d4be92;letter-spacing:1px;text-transform:uppercase;">Negligencias médicas</span>
</td></tr>
<tr><td style="padding:32px;">${content}</td></tr>
<tr><td style="background-color:${C.page};padding:20px 32px;border-top:1px solid ${C.line};text-align:center;">
<p style="margin:0;font-size:12px;color:${C.muted};">GVC Expertos — www.gvcexpertos.com</p>
<p style="margin:6px 0 0;font-size:11px;color:${C.line};">Este correo se ha enviado de forma automática.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

export function getContactNotificationTemplate({
  name,
  email,
  phone,
  service,
  message,
  contactType,
  company,
  referralSource,
}: {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  contactType?: string
  company?: string
  referralSource?: string
}) {
  const isPro = contactType === 'professional'
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = phone ? escapeHtml(phone) : ''
  const safeCompany = company ? escapeHtml(company) : ''
  const safeService = service ? escapeHtml(service) : ''
  const referral = referralSource ? escapeHtml(referralLabel(referralSource)) : ''
  const safeMessage = escapeHtml(message)
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${isPro ? C.accent : C.ink};">Nueva consulta${isPro ? ' (Profesional)' : ''}</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">${new Date().toLocaleDateString('es-ES')} — ${safeName}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 2px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Contacto</p>
<p style="margin:0;font-size:14px;font-weight:bold;">${safeName}</p>
${safeCompany ? `<p style="margin:2px 0 0;font-size:13px;color:${C.muted};">${safeCompany}</p>` : ''}
<p style="margin:4px 0 0;font-size:13px;"><a href="mailto:${safeEmail}" style="color:${C.accent};">${safeEmail}</a></p>
${safePhone ? `<p style="margin:2px 0 0;font-size:13px;">${safePhone}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Tipo de consulta</p>
<p style="margin:0;font-size:13px;"><strong>${isPro ? 'Profesional' : 'Particular'}</strong>${safeService ? ` — ${safeService}` : ''}</p>
${referral ? `<p style="margin:8px 0 0;font-size:13px;color:${C.muted};">Origen: ${referral}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Mensaje</p>
<p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${safeMessage}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<a href="https://www.gvcexpertos.com/admin/contactos" style="display:inline-block;padding:12px 32px;background-color:${C.accent};color:#ffffff;font-size:13px;font-weight:bold;text-transform:uppercase;text-decoration:none;letter-spacing:1px;">Ver en el panel admin</a>
</td></tr></table>`)
}

export function getContactConfirmationTemplate({
  name,
  message,
}: {
  name: string
  message?: string
}) {
  const safeName = escapeHtml(name)
  const safeMessage = message ? escapeHtml(message) : ''
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${C.ink};">Hemos recibido tu consulta</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">GVC Expertos</p>
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">Estimado/a <strong>${safeName}</strong>,</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;">Gracias por contactar con GVC Expertos. Un abogado especializado te responderá en menos de 24 horas.</p>
${safeMessage ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Tu mensaje</p>
<p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${safeMessage}</p>
</td></tr></table>` : ''}
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;">Si el caso es urgente, llama al <a href="tel:+34968241025" style="color:${C.accent};">968 241 025</a> o responde a este correo.</p>
<p style="margin:24px 0 0;font-size:14px;line-height:1.6;">Plaza Fuensanta, 3 - 6ºB, 30008 Murcia</p>`)
}
