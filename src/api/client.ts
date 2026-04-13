const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = opts

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? `Request failed: ${res.status}`)
  }

  return res.json()
}

async function upload<T>(path: string, formData: FormData, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    // No Content-Type header — browser sets it with the multipart boundary
    headers,
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? `Request failed: ${res.status}`)
  }

  return res.json()
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown, headers?: Record<string, string>) => request<T>(path, { method: 'POST', body, headers }),
  put:    <T>(path: string, body: unknown, headers?: Record<string, string>) => request<T>(path, { method: 'PUT', body, headers }),
  delete: <T>(path: string, headers?: Record<string, string>) => request<T>(path, { method: 'DELETE', headers }),
  upload: <T>(path: string, formData: FormData, headers?: Record<string, string>) => upload<T>(path, formData, headers),
}
