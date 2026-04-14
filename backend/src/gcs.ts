import { Storage } from '@google-cloud/storage'
import path from 'node:path'

const bucketName = process.env.GCS_BUCKET

// GCS is optional. When GCS_BUCKET is unset, upload/delete are no-ops and
// getSignedUrl returns the raw object path unchanged.
export const gcsEnabled = Boolean(bucketName)

// Required on Cloud Run when using ADC (no key file) to enable signBlob via
// the IAM Credentials API. Set to the email of the Cloud Run service account.
// e.g. my-sa@my-project.iam.gserviceaccount.com
const serviceAccountEmail = process.env.GCS_SERVICE_ACCOUNT_EMAIL

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
// On Cloud Run (ADC without a key file), set GCS_SERVICE_ACCOUNT_EMAIL to the
// service account email and grant it roles/iam.serviceAccountTokenCreator on itself.
export async function getSignedUrl(objectPath: string): Promise<string> {
  if (!bucket) return objectPath

  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
    ...(serviceAccountEmail ? { issuer: serviceAccountEmail } : {}),
  })
  return url
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