import { Router, type Request, type Response, type NextFunction } from 'express'

export function requireAdminToken(req: Request, res: Response, next: NextFunction) {
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