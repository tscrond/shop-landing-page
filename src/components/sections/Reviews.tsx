import { useState, useEffect, type FormEvent } from 'react'
import { getReviews, addReview, type Review } from '@/api'

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 9

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getReviews()
      .then(data => { setReviews(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    if (!name.trim() || !description.trim() || rating === 0) {
      setFormError('Wypełnij wszystkie pola i wybierz ocenę.')
      return
    }

    setFormLoading(true)
    try {
      const newReview = await addReview({ name: name.trim(), description: description.trim(), rating })
      setReviews(prev => {
        const updated = [...prev, newReview]
        setPage(Math.floor((updated.length - 1) / PAGE_SIZE))
        return updated
      })
      setName('')
      setDescription('')
      setRating(0)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Nie udało się dodać opinii.')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="no-scrollbar relative flex flex-col items-center h-full w-full px-4 overflow-y-auto pt-20 pb-24 sm:pb-10">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[15%] left-[8%] w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[8%] w-[250px] h-[250px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">Opinie klientów</h2>
          <p className="text-gray-400 text-sm sm:text-base">⭐ Co mówią nasi klienci</p>
        </div>

        {/* Reviews grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <i className="pi pi-spinner pi-spin text-white/40 text-2xl" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Brak opinii. Bądź pierwszym recenzentem!
          </div>
        ) : (() => {
          const totalPages = Math.ceil(reviews.length / PAGE_SIZE)
          const visible = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
          return (
            <>
              <div className="flex flex-wrap justify-center gap-4">
                {visible.map(review => (
                  <div
                    key={review.id}
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex flex-col gap-3"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <i
                          key={s}
                          className={`pi ${s <= review.rating ? 'pi-star-fill text-amber-400' : 'pi-star text-white/20'} text-sm`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed flex-1">{review.description}</p>
                    <p className="text-white font-medium text-sm">— {review.name}</p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (() => {
                const WINDOW = 8
                const half = Math.floor(WINDOW / 2)
                let start = Math.max(0, page - half)
                const end = Math.min(totalPages, start + WINDOW)
                start = Math.max(0, end - WINDOW) // re-anchor when near the end
                const pageNums = Array.from({ length: end - start }, (_, i) => start + i)

                return (
                  <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    {/* First page + ellipsis */}
                    {start > 0 && (
                      <>
                        <button onClick={() => setPage(0)} className="page-btn">1</button>
                        {start > 1 && <span className="text-white/30 text-sm px-1">…</span>}
                      </>
                    )}

                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 0}
                      className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <i className="pi pi-chevron-left text-xs" />
                    </button>

                    {pageNums.map(i => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          page === i
                            ? 'bg-sky-400 text-white shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                            : 'border border-white/10 bg-white/5 text-white/50 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= totalPages - 1}
                      className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <i className="pi pi-chevron-right text-xs" />
                    </button>

                    {/* Ellipsis + last page */}
                    {end < totalPages && (
                      <>
                        {end < totalPages - 1 && <span className="text-white/30 text-sm px-1">…</span>}
                        <button onClick={() => setPage(totalPages - 1)} className="page-btn">{totalPages}</button>
                      </>
                    )}
                  </div>
                )
              })()}
            </>
          )
        })()}

        {/* Divider */}
        <div className="my-6 sm:my-8 border-t border-white/10" />

        {/* Submit form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Podziel się swoją opinią</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Imię</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Np. Jan Kowalski"
                className="input-field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Ocena</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <i className={`pi ${s <= (hoveredStar || rating) ? 'pi-star-fill text-amber-400' : 'pi-star text-white/30'} text-xl`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Opinia</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Podziel się swoją opinią o naszych produktach..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            {submitted && <p className="text-emerald-400 text-sm">Dziękujemy za opinię!</p>}

            <button
              type="submit"
              disabled={formLoading}
              className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading
                ? <><i className="pi pi-spinner pi-spin" /> Wysyłanie...</>
                : <><i className="pi pi-send" /> Wyślij opinię</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
