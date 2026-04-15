import { Router, type Request, type Response } from 'express'
import { getDatabase } from '../db.js'
import { requireAdminToken } from './middleware.js'

export const reviewsRouter = Router()

// GET /api/reviews — public
reviewsRouter.get('/reviews', async (_req, res) => {
  const rows = await getDatabase().getAllReviews()
  res.json(rows)
})

// POST /api/reviews — public
reviewsRouter.post('/reviews', async (req: Request, res: Response) => {
  const { name, description, rating } = req.body ?? {}

  if (typeof name !== 'string' || !name.trim() ||
      typeof description !== 'string' || !description.trim() ||
      rating === undefined) {
    res.status(400).json({ ok: false, message: 'Brakuje wymaganych pól: name, description, rating.' })
    return
  }

  if (name.length > 100) {
    res.status(400).json({ ok: false, message: 'Imię może mieć maksymalnie 100 znaków.' })
    return
  }

  if (description.length > 300) {
    res.status(400).json({ ok: false, message: 'Opinia może mieć maksymalnie 300 znaków.' })
    return
  }

  const ratingNum = Number(rating)
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    res.status(400).json({ ok: false, message: 'Rating musi być liczbą całkowitą od 1 do 5.' })
    return
  }

  const row = await getDatabase().insertReview({
    name: name.trim(),
    description: description.trim(),
    rating: ratingNum,
  })
  res.status(201).json(row)
})

reviewsRouter.delete('/reviews/:id', requireAdminToken, async (req: Request, res: Response) => {
  const id = String(req.params.id)
  const deleted = await getDatabase().deleteReview(id)
  if (!deleted) {
    res.status(404).json({ ok: false, message: 'Product not found.' })
    return
  }
  res.json({ok: true})
})