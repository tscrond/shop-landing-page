import { useState, type FormEvent } from 'react'
import { sendContactMessage } from '@/api'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const subject = (form.get('subject') as string).trim()
    const email = (form.get('email') as string).trim()
    const message = (form.get('message') as string).trim()

    if (!subject || !email || !message) {
      setError('Wypełnij wszystkie pola.')
      setLoading(false)
      return
    }

    try {
      await sendContactMessage({ subject, email, message })
      setSubmitted(true)
      formEl.reset()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się wysłać wiadomości.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full px-4">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[25%] right-[10%] w-[300px] h-[300px] bg-sky-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-violet-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-1 sm:mb-2">Skontaktuj się z nami</h2>
          <p className="text-gray-400 text-sm sm:text-base">Odpowiemy najszybciej jak to możliwe</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-8">
          <form className="flex flex-col gap-3 sm:gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Temat</label>
              <input
                name="subject"
                type="text"
                placeholder="Np. Zapytanie o łóżko Stiegelmeyer"
                className="input-field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Adres e-mail</label>
              <input
                name="email"
                type="email"
                placeholder="jan@przyklad.pl"
                className="input-field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Wiadomość</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Napisz do nas..."
                className="input-field resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold transition-all cursor-pointer shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><i className="pi pi-spin pi-spinner mr-2" />Wysyłanie...</>
              ) : (
                <><i className="pi pi-send mr-2" />Wyślij wiadomość</>
              )}
            </button>
            {error && (
              <p className="text-red-400 text-sm text-center animate-fade-in">
                <i className="pi pi-exclamation-circle mr-1" />
                {error}
              </p>
            )}
            {submitted && (
              <p className="text-emerald-400 text-sm text-center animate-fade-in">
                <i className="pi pi-check-circle mr-1" />
                Wiadomość wysłana!
              </p>
            )}
          </form>
        </div>

        {/* Contact info below */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 sm:mt-8 text-xs sm:text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <i className="pi pi-phone text-sky-400" />
            +48 123 123 123
          </span>
          <span className="flex items-center gap-2">
            <i className="pi pi-map-marker text-sky-400" />
            Polska
          </span>
        </div>
      </div>
    </div>
  )
}
