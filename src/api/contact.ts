import { api } from './client'

export interface ContactPayload {
  subject: string
  email: string
  message: string
}

export interface ContactResponse {
  ok: boolean
  message: string
}

export function sendContactMessage(data: ContactPayload) {
  return api.post<ContactResponse>('/contact', data)
}
