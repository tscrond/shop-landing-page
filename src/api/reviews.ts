import { api } from './client'

export interface Review {
  id: string
  name: string
  description: string
  rating: number
  createdAt: string
}

export interface ReviewPayload {
  name: string
  description: string
  rating: number
}

export function getReviews() {
  return api.get<Review[]>('/reviews')
}

export function addReview(data: ReviewPayload) {
  return api.post<Review>('/reviews', data)
}

export function deleteReview(id: string, token: string) {
  return api.delete<{ ok: boolean }>(`/reviews/${id}`, { Authorization: `Bearer ${token}` })
}
