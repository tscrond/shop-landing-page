import { api } from './client'

export interface Product {
  id: string
  name: string
  description: string
  badge: string
  badgeColor: string
  imageUrl: string | null
}

export function getProducts() {
  return api.get<Product[]>('/products')
}

export function addProduct(formData: FormData, token: string) {
  return api.upload<Product>('/products', formData, { Authorization: `Bearer ${token}` })
}

export function deleteProduct(id: string, token: string) {
  return api.delete<{ ok: boolean }>(`/products/${id}`, { Authorization: `Bearer ${token}` })
}
