export interface ProductRow {
  id: string
  name: string
  description: string
  badge: string
  badgeColor: string
  imageUrl: string | null
  createdAt: Date
}

export interface ProductInsertData {
  name: string
  description: string
  badge: string
  badgeColor: string
  imageUrl: string | null
}

export interface IDatabase {
  /** Create schema / seed default data on first run. */
  init(): Promise<void>
  getAllProducts(): Promise<ProductRow[]>
  insertProduct(data: ProductInsertData): Promise<ProductRow>
  /** Returns the deleted row, or null if not found. */
  deleteProduct(id: string): Promise<ProductRow | null>
}
