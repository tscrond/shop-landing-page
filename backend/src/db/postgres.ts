import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import * as schema from '../schema.js'
import { products, reviews } from '../schema.js'
import type { IDatabase, ProductRow, ProductInsertData, ReviewRow, ReviewInsertData } from './types.js'
import { DEFAULT_PRODUCTS } from './seeds.js'

export class PostgresDatabase implements IDatabase {
  private client: postgres.Sql
  private orm: ReturnType<typeof drizzle<typeof schema>>

  constructor(url: string) {
    this.client = postgres(url, { max: 10 })
    this.orm = drizzle(this.client, { schema })
  }

  async init(): Promise<void> {

    await this.client`
      CREATE TABLE IF NOT EXISTS products (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT        NOT NULL,
        description TEXT        NOT NULL,
        badge       TEXT        NOT NULL,
        badge_color TEXT        NOT NULL,
        image_url   TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `

    await this.client`
      CREATE TABLE IF NOT EXISTS reviews (
        id  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        description TEXT  NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `

    await this.client`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT
    `

    const existing = await this.orm.select({ id: products.id }).from(products).limit(1)
    if (existing.length === 0) {
      await this.orm.insert(products).values(DEFAULT_PRODUCTS)
    }
  }

  async getAllProducts(): Promise<ProductRow[]> {
    const rows = await this.orm.select().from(products).orderBy(products.createdAt)
    return rows.map(r => ({ ...r, imageUrl: r.imageUrl ?? null }))
  }

  async insertProduct(data: ProductInsertData): Promise<ProductRow> {
    const [row] = await this.orm.insert(products).values(data).returning()
    return { ...row, imageUrl: row.imageUrl ?? null }
  }

  async deleteProduct(id: string): Promise<ProductRow | null> {
    const [row] = await this.orm.delete(products).where(eq(products.id, id)).returning()
    if (!row) return null
    return { ...row, imageUrl: row.imageUrl ?? null }
  }

  async getAllReviews(): Promise<ReviewRow[]> {
    const rows = await this.orm.select().from(reviews).orderBy(reviews.createdAt)
    return rows.map(r => ({ ...r}))
  }

  async insertReview(data: ReviewInsertData): Promise<ReviewRow> {
    const [row] = await this.orm.insert(reviews).values({ ...data, rating: Number(data.rating) }).returning()
    return {...row}
  }

  async deleteReview(id: string): Promise<ReviewRow | null> {
    const [row] = await this.orm.delete(reviews).where(eq(reviews.id, id)).returning()
    if (!row) return null
    return {...row}
  }
}
