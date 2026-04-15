import { useState, useEffect, type FormEvent, useRef } from 'react'
import { getProducts, addProduct, deleteProduct, type Product, getReviews, deleteReview, type Review } from '@/api'

const TOKEN_KEY = 'ADMIN_TOKEN'

export default function AdminView() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '')
  const [tokenInput, setTokenInput] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const isAuthed = token.length > 0

  useEffect(() => {
    if (!isAuthed) return
    getProducts().then(setProducts).catch(() => setError('Failed to load products.'))
    getReviews().then(setReviews).catch(() => setError('Failed to load reviews.'))
  }, [isAuthed])

  async function login(e: FormEvent) {
    e.preventDefault()
    const candidate = tokenInput.trim()
    if (!candidate) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${candidate}` },
      })
      if (!res.ok) {
        setError('Invalid token.')
        return
      }
      sessionStorage.setItem(TOKEN_KEY, candidate)
      setToken(candidate)
      setTokenInput('')
    } catch {
      setError('Could not reach server.')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setProducts([])
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const formEl = e.currentTarget

    const data = new FormData(formEl)
    const name        = (data.get('name') as string).trim()
    const description = (data.get('description') as string).trim()
    const badge       = (data.get('badge') as string).trim()
    const badgeColor  = data.get('badgeColor') as string
    const imageFile   = data.get('image') as File | null

    if (!name || !description || !badge || !badgeColor) {
      setError('All fields are required.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('badge', badge)
    formData.append('badgeColor', badgeColor)
    if (imageFile && imageFile.size > 0) formData.append('image', imageFile)

    setLoading(true)
    try {
      const product = await addProduct(formData, token)
      setProducts(prev => [...prev, product])
      formEl.reset()
      setPreview(null)
      setSuccess(`Product "${product.name}" added.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    setError(null)
    setSuccess(null)
    try {
      await deleteProduct(id, token)
      setProducts(prev => prev.filter(p => p.id !== id))
      setSuccess(`Product "${name}" deleted.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.')
    }
  }

  async function handleDeleteReview(id: string, reviewName: string) {
    setError(null)
    setSuccess(null)
    try {
      await deleteReview(id, token)
      setReviews(prev => prev.filter(r => r.id !== id))
      setSuccess(`Review by "${reviewName}" deleted.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review.')
    }
  }

  async function handleDeleteAllReviews() {
    if (!window.confirm(`Delete all ${reviews.length} reviews? This cannot be undone.`)) return
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await Promise.all(reviews.map(r => deleteReview(r.id, token)))
      setReviews([])
      setSuccess('All reviews deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all reviews.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] px-4">
        <form onSubmit={login} className="w-full max-w-sm flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-xl font-bold text-white">Admin</h1>
          <input
            type="password"
            placeholder="Admin token"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            className="input-field"
            autoFocus
          />
          <button type="submit" disabled={loading} className="py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all cursor-pointer">
            {loading ? <><i className="pi pi-spin pi-spinner mr-2" />Verifying…</> : 'Sign in'}
          </button>
          {error && <p className="text-red-400 text-sm text-center"><i className="pi pi-exclamation-circle mr-1" />{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] px-4 py-10 text-white">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product management</h1>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
            <i className="pi pi-sign-out mr-1" />Sign out
          </button>
        </div>

        {/* Add product form */}
        <form ref={formRef} onSubmit={handleAdd} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Add product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400">Name</label>
              <input name="name" type="text" placeholder="Stiegelmeyer — łóżko nowe" className="input-field" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400">Badge label</label>
              <input name="badge" type="text" placeholder="Nowe" className="input-field" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea name="description" rows={3} placeholder="Product description…" className="input-field resize-y" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400">Badge color</label>
              <select name="badgeColor" className="input-field">
                <option value="bg-emerald-500" className="text-black">🟢 Emerald — Nowe</option>
                <option value="bg-amber-500" className="text-black">🟡 Amber — Używane</option>
                <option value="bg-sky-500" className="text-black">🔵 Sky</option>
                <option value="bg-red-500" className="text-black">🔴 Red</option>
                <option value="bg-violet-500" className="text-black">🟣 Violet</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400">Product image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-sky-600 file:text-white file:cursor-pointer cursor-pointer"
                onChange={e => {
                  const file = e.target.files?.[0]
                  setPreview(file ? URL.createObjectURL(file) : null)
                }}
              />
            </div>
          </div>

          {preview && (
            <div className="flex items-center gap-3">
              <img src={preview} alt="Preview" className="h-24 w-24 object-contain rounded-xl border border-white/10 bg-gray-900" />
              <span className="text-xs text-gray-400">Image preview</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="self-end px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all cursor-pointer"
          >
            {loading ? <><i className="pi pi-spin pi-spinner mr-2" />Uploading…</> : <><i className="pi pi-plus mr-2" />Add</>}
          </button>
        </form>

        {error   && <p className="text-red-400 text-sm"><i className="pi pi-exclamation-circle mr-1" />{error}</p>}
        {success && <p className="text-emerald-400 text-sm"><i className="pi pi-check-circle mr-1" />{success}</p>}

        {/* Product list */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Current products ({products.length})</h2>
          {products.length === 0 && <p className="text-gray-500 text-sm">No products yet.</p>}
          {products.map(p => (
            <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-4 min-w-0">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="shrink-0 h-14 w-14 object-contain rounded-lg border border-white/10 bg-gray-900" />
                  : <div className="shrink-0 h-14 w-14 rounded-lg border border-white/10 bg-gray-900 flex items-center justify-center text-gray-600"><i className="pi pi-image" /></div>
                }
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`${p.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{p.badge}</span>
                    <span className="font-medium text-sm truncate">{p.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="shrink-0 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete"
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          ))}
        </div>

        {/* Reviews list */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Reviews ({reviews.length})</h2>
            {reviews.length > 0 && (
              <button
                onClick={handleDeleteAllReviews}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium cursor-pointer"
              >
                {loading
                  ? <><i className="pi pi-spin pi-spinner" /> Deleting…</>
                  : <><i className="pi pi-trash" /> Delete all</>}
              </button>
            )}
          </div>
          {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
          {reviews.map(r => (
            <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{r.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className={`pi ${s <= r.rating ? 'pi-star-fill text-amber-400' : 'pi-star text-white/20'} text-xs`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{r.description}</p>
              </div>
              <button
                onClick={() => handleDeleteReview(r.id, r.name)}
                className="shrink-0 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete review"
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
