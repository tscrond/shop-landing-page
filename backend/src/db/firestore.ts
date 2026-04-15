import { Firestore, Timestamp, type DocumentData } from '@google-cloud/firestore'
import type { IDatabase, ProductRow, ProductInsertData, ReviewRow, ReviewInsertData } from './types.js'
import { DEFAULT_PRODUCTS } from './seeds.js'

const COLLECTION = 'products'
const REVIEWS_COLLECTION = 'reviews'

function docToRow(id: string, d: DocumentData): ProductRow {
  return {
    id,
    name:        d.name,
    description: d.description,
    badge:       d.badge,
    badgeColor:  d.badgeColor,
    imageUrl:    d.imageUrl ?? null,
    createdAt:   (d.createdAt as Timestamp).toDate(),
  }
}

function reviewDocToRow(id: string, d: DocumentData): ReviewRow {
  return {
    id,
    name:        d.name,
    description: d.description,
    rating:      d.rating,
    createdAt:   (d.createdAt as Timestamp).toDate(),
  }
}

export class FirestoreDatabase implements IDatabase {
  // Uses Application Default Credentials (ADC).
  // On GCP (Cloud Run, GKE, etc.) this works automatically.
  // Locally, set GOOGLE_APPLICATION_CREDENTIALS to a service account key file,
  // or run `gcloud auth application-default login`.
  private firestore: Firestore

  constructor() {
    this.firestore = new Firestore()
  }

  async init(): Promise<void> {
    const snapshot = await this.firestore.collection(COLLECTION).limit(1).get()
    if (!snapshot.empty) return

    const batch = this.firestore.batch()
    for (const data of DEFAULT_PRODUCTS) {
      const ref = this.firestore.collection(COLLECTION).doc()
      batch.set(ref, { ...data, createdAt: Timestamp.now() })
    }
    await batch.commit()
  }

  async getAllProducts(): Promise<ProductRow[]> {
    const snapshot = await this.firestore
      .collection(COLLECTION)
      .orderBy('createdAt')
      .get()
    return snapshot.docs.map(doc => docToRow(doc.id, doc.data()))
  }

  async insertProduct(data: ProductInsertData): Promise<ProductRow> {
    const ref = await this.firestore.collection(COLLECTION).add({
      ...data,
      createdAt: Timestamp.now(),
    })
    const doc = await ref.get()
    return docToRow(doc.id, doc.data()!)
  }

  async deleteProduct(id: string): Promise<ProductRow | null> {
    const ref = this.firestore.collection(COLLECTION).doc(id)
    const doc = await ref.get()
    if (!doc.exists) return null
    const row = docToRow(doc.id, doc.data()!)
    await ref.delete()
    return row
  }

  async getAllReviews(): Promise<ReviewRow[]> {
    const snapshot = await this.firestore.collection(REVIEWS_COLLECTION).orderBy('createdAt').get()
    return snapshot.docs.map(doc => reviewDocToRow(doc.id, doc.data()))
  }

  async insertReview(data: ReviewInsertData): Promise<ReviewRow> {
    const ref = await this.firestore.collection(REVIEWS_COLLECTION).add({
      ...data,
      rating: Number(data.rating),
      createdAt: Timestamp.now(),
    })
    const doc = await ref.get()
    return reviewDocToRow(doc.id, doc.data()!)
  }

  async deleteReview(id: string): Promise<ReviewRow | null> {
    const ref = this.firestore.collection(REVIEWS_COLLECTION).doc(id)
    const doc = await ref.get()
    if (!doc.exists) return null
    const row = reviewDocToRow(doc.id, doc.data()!)
    await ref.delete()
    return row
  }
}
