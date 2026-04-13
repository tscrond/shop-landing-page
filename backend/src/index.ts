import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import { contactRouter } from './routes/contact.js'
import { healthRouter } from './routes/health.js'
import { productsRouter } from './routes/products.js'
import { initDb } from './db.js'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

// Security & parsing
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'blob:', 'data:', 'https://storage.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    },
  },
}))
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

// Routes
app.use('/api', healthRouter)
app.use('/api', contactRouter)
app.use('/api', productsRouter)

// In production, serve the frontend static build
if (process.env.SERVE_STATIC) {
  const staticDir = path.resolve(process.env.SERVE_STATIC)
  app.use(express.static(staticDir))
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })
}

app.listen(PORT, async () => {
  await initDb()
  console.log(`[backend] listening on :${PORT}`)
})
