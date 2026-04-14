import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env

export const mailerEnabled =
  Boolean(SMTP_HOST) && Boolean(SMTP_PORT) && Boolean(SMTP_USERNAME) && Boolean(SMTP_PASSWORD)

const transporter = mailerEnabled
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT!, 10),
      secure: false, // STARTTLS on port 587
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    })
  : null

export interface SendMailOptions {
  replyTo: string
  subject: string
  body: string
}

export async function sendMail({ replyTo, subject, body }: SendMailOptions): Promise<void> {
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — skipping email delivery.')
    return
  }

  await transporter.sendMail({
    from:    '"Formularz kontaktowy" <noreply@skrond.com>',
    to:      'lozka@skrond.com',
    replyTo,
    subject,
    text: body,
    html: `<pre style="font-family:sans-serif;white-space:pre-wrap;">${body}</pre>`,
  })
}
