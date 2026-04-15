import { useState, useEffect } from 'react'
import { Image } from 'primereact/image'
import { getProducts, type Product } from '@/api'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const itemsPerPage = isMobile ? 1 : 3
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(products.length / itemsPerPage)

  // Reset page when items-per-page changes
  useEffect(() => { setPage(0) }, [itemsPerPage])

  const visible = products.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
  const next = () => setPage((p) => (p + 1) % totalPages)

  return (
    <div className="relative flex flex-col justify-center items-center h-full w-full px-4 overflow-y-auto pt-8 pb-24 sm:pb-10">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[20%] left-[5%] w-[350px] h-[350px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[300px] h-[300px] bg-sky-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3">Łóżka rehabilitacyjne w ofercie</h2>
        <p className="text-gray-400 text-sm sm:text-lg">
          🛏️ Łóżka nowe/używane z gwarancją — <span className="text-white font-medium">Stiegelmeyer</span>, <span className="text-white font-medium">Vermeiren</span>, <span className="text-white font-medium">Burmeier</span>
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={prev}
            className="shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110"
          >
            <i className="pi pi-chevron-left text-xs sm:text-base" />
          </button>

          <div className={`grid gap-5 flex-1 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {visible.map((data, i) => (
              <div
                key={page * itemsPerPage + i}
                className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-3 sm:p-6">
                  <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 ${data.badgeColor} text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg`}>
                    {data.badge}
                  </span>
                  <Image src={data.imageUrl ?? '/lozko.jpg'} alt="Łóżko rehabilitacyjne" imageClassName="h-32 sm:h-48 object-contain" preview />
                </div>
                <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1">
                  <h3 className="text-sm sm:text-lg font-semibold text-white">{data.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed overflow-y-auto max-h-[100px] sm:max-h-[140px]">
                    {data.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110"
          >
            <i className="pi pi-chevron-right text-xs sm:text-base" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === page
                  ? 'w-8 h-3 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                  : 'w-3 h-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
