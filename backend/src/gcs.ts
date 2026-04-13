import { Storage } from '@google-cloud/storage'
import path from 'node:path'

const bucketName = process.env.GCS_BUCKET

// GCS is optional. When GCS_BUCKET is unset, upload/delete are no-ops and
// getSignedUrl returns the raw object path unchanged.
export const gcsEnabled = Boolean(bucketName)

const storage = gcsEnabled ? new Storage() : null
const bucket  = gcsEnabled ? storage!.bucket(bucketName!) : null

// Returns the GCS object path (e.g. "products/123-abc.jpg") — store this in the DB.
export async function uploadToGcs(file: Express.Multer.File): Promise<string> {
  if (!bucket) throw new Error('GCS_BUCKET is not configured — cannot upload images.')

  const ext = path.extname(file.originalname).toLowerCase()
  const objectPath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  await bucket.file(objectPath).save(file.buffer, {
    contentType: file.mimetype,
  })

  return objectPath
}

// Generate a short-lived signed URL for reading a private object.
// Falls back to the raw object path if signing credentials are unavailable.
export async function getSignedUrl(objectPath: string): Promise<string> {
  if (!bucket) return objectPath

  try {
    const [url] = await bucket.file(objectPath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    })
    return url
  } catch (err) {
    // Service account key required for signing — fall back to raw path.
    // Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON to enable signed URLs.
    console.warn('[gcs] Signing unavailable, returning raw object path:', (err as Error).message)
    return objectPath
  }
}

// objectPath is the value stored in the DB (e.g. "products/123-abc.jpg").
export async function deleteFromGcs(objectPath: string): Promise<void> {
  if (!bucket) return

  try {
    await bucket.file(objectPath).delete({ ignoreNotFound: true })
  } catch {
    console.warn('[gcs] Failed to delete file:', objectPath)
  }
}