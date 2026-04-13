import { Router, type Request, type Response, type NextFunction } from 'express'
import { eq } from 'drizzle-orm'
import multer from 'multer'
import { db } from '../db.js'
import { products } from '../schema.js'
import type { ProductSelect } from '../schema.js'
import { uploadToGcs, deleteFromGcs, getSignedUrl } from '../gcs.js'

export const productsRouter = Router()

// Store file in memory so we can stream it to GCS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed.'))
  },
})

export type Product = {
  id: string
  name: string
  description: string
  badge: string
  badgeColor: string
  imageUrl: string | null
}

function rowToProduct(row: ProductSelect): Product {
  return { id: row.id, name: row.name, description: row.description, badge: row.badge, badgeColor: row.badgeColor, imageUrl: row.imageUrl ?? null }
}

function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    res.status(500).json({ ok: false, message: 'Server misconfiguration: ADMIN_TOKEN not set.' })
    return
  }
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (token !== adminToken) {
    res.status(401).json({ ok: false, message: 'Unauthorized.' })
    return
  }
  next()
}

// GET /api/admin/verify — used by frontend to validate token before storing
productsRouter.get('/admin/verify', requireAdminToken, (_req, res) => {
  res.json({ ok: true })
})

// GET /api/products — public
productsRouter.get('/products', async (_req, res) => {
  const rows = await db.select().from(products).orderBy(products.createdAt)
  const result = await Promise.all(
    rows.map(async row => {
      const p = rowToProduct(row)
      if (p.imageUrl) p.imageUrl = await getSignedUrl(p.imageUrl)
      return p
    })
  )
  res.json(result)
})

// POST /api/products — admin only, multipart/form-data
productsRouter.post('/products', requireAdminToken, upload.single('image'), async (req: Request, res: Response) => {
  const { name, description, badge, badgeColor } = req.body

  if (!name || !description || !badge || !badgeColor) {
    res.status(400).json({ ok: false, message: 'All fields are required: name, description, badge, badgeColor.' })
    return
  }
  if ([name, description, badge, badgeColor].some((f: unknown) => typeof f !== 'string')) {
    res.status(400).json({ ok: false, message: 'All fields must be strings.' })
    return
  }

  const imageUrl = req.file ? await uploadToGcs(req.file) : null

  const [row] = await db.insert(products).values({ name, description, badge, badgeColor, imageUrl }).returning()
  res.status(201).json(rowToProduct(row))
})

// DELETE /api/products/:id — admin only
productsRouter.delete('/products/:id', requireAdminToken, async (req: Request, res: Response) => {
  const id = String(req.params.id)
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning()
  if (!deleted) {
    res.status(404).json({ ok: false, message: 'Product not found.' })
    return
  }
  // Clean up GCS object
  if (deleted.imageUrl) await deleteFromGcs(deleted.imageUrl)
  res.json({ ok: true })
})
