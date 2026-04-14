import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { sendMail } from '../mailer.js'

export const contactRouter = Router()

// Rate-limit contact form: 5 requests per 15 min per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later.' },
})

contactRouter.post('/contact', contactLimiter, async (req: Request, res: Response) => {
  const { subject, email, message } = req.body

  // Validate input
  if (!subject || !email || !message) {
    res.status(400).json({ ok: false, message: 'All fields are required.' })
    return
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ ok: false, message: 'Please provide a valid email address.' })
    return
  }

  console.log('[contact]', { subject, email, message: message.slice(0, 100) })

  await sendMail({ replyTo: email, subject, body: message })

  res.json({ ok: true, message: 'Message sent successfully.' })
})
