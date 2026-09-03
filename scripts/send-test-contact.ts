import {
  sendEmail,
  getContactNotificationTemplate,
  getContactConfirmationTemplate,
} from '../lib/email'

async function main() {
  const to = process.env.SMTP_TO?.trim() || 'contacto@gvcabogados.com'
  const lead = {
    name: 'Narciso (prueba diseño)',
    email: to,
    phone: '628 823 404',
    service: 'Negligencias médicas',
    contactType: 'particular',
    referralSource: 'google',
    message:
      'Prueba del diseño de correo GVC Expertos: este es el par aviso al despacho + confirmación al cliente.',
  }

  const admin = await sendEmail({
    to,
    subject: `[Web] Nueva consulta de ${lead.name}`,
    html: getContactNotificationTemplate(lead),
    replyTo: lead.email,
  })

  const client = await sendEmail({
    to: lead.email,
    subject: 'Hemos recibido tu consulta — GVC Expertos',
    html: getContactConfirmationTemplate({
      name: lead.name,
      message: lead.message,
    }),
  })

  console.log('GVC Expertos', JSON.stringify({ admin: { ok: admin.success }, client: { ok: client.success } }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
