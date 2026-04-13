import { Storage } from '@google-cloud/storage'
import path from 'node:path'

const bucketName = process.env.GCS_BUCKET

if (!bucketName) {
  throw new Error('GCS_BUCKET environment variable is not set.')
}

// On Cloud Run, Application Default Credentials are used automatically.
// Locally, set GOOGLE_APPLICATION_CREDENTIALS to point to a service account key file.
const storage = new Storage()
const bucket = storage.bucket(bucketName)

// Returns the GCS object path (e.g. "products/123-abc.jpg") — store this in the DB.
export async function uploadToGcs(file: Express.Multer.File): Promise<string> {
  const ext = path.extname(file.originalname).toLowerCase()
  const objectPath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  await bucket.file(objectPath).save(file.buffer, {
    contentType: file.mimetype,
  })

  return objectPath
}

// Generate a short-lived signed URL for reading a private object.
export async function getSignedUrl(objectPath: string): Promise<string> {
  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  })
  return url
}

// objectPath is the value stored in the DB (e.g. "products/123-abc.jpg").
export async function deleteFromGcs(objectPath: string): Promise<void> {
  try {
    await bucket.file(objectPath).delete({ ignoreNotFound: true })
  } catch {
    console.warn('[gcs] Failed to delete file:', objectPath)
  }
}