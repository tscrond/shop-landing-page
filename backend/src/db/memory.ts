import { randomUUID } from 'node:crypto'
import type { IDatabase, ProductRow, ProductInsertData } from './types.js'
import { DEFAULT_PRODUCTS } from './seeds.js'

export class MemoryDatabase implements IDatabase {
  private rows: ProductRow[] = []

  async init(): Promise<void> {
    this.rows = DEFAULT_PRODUCTS.map(data => ({
      ...data,
      id:        randomUUID(),
      createdAt: new Date(),
    }))
  }

  async getAllProducts(): Promise<ProductRow[]> {
    return [...this.rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  async insertProduct(data: ProductInsertData): Promise<ProductRow> {
    const row: ProductRow = { ...data, id: randomUUID(), createdAt: new Date() }
    this.rows.push(row)
    return row
  }

  async deleteProduct(id: string): Promise<ProductRow | null> {
    const idx = this.rows.findIndex(r => r.id === id)
    if (idx === -1) return null
    const [removed] = this.rows.splice(idx, 1)
    return removed
  }
}
