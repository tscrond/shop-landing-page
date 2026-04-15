import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import Home from '../components/sections/Home'
import Features from '../components/sections/Features'
import Products from '../components/sections/Products'
import Contact from '../components/sections/Contact'
import Reviews from '../components/sections/Reviews'

const SECTION_IDS = ['home', 'features', 'products', 'contact', 'reviews'] as const
const TOTAL = SECTION_IDS.length

const SECTION_LABELS: Record<typeof SECTION_IDS[number], string> = {
  home:     'Strona główna',
  features: 'Nasza oferta',
  products: 'Produkty',
  contact:  'Kontakt',
  reviews:  'Opinie',
}

export default function HomeView() {
  const [currentSection, setCurrentSection] = useState(0)
  const [_, setDirection] = useState(0) // -1 up, 1 down
  const isAnimating = useRef(false)

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL || index === currentSection || isAnimating.current) return
    setDirection(index > currentSection ? 1 : -1)
    setCurrentSection(index)
    isAnimating.current = true
    setTimeout(() => { isAnimating.current = false }, 700)
  }, [currentSection])

  const goUp = useCallback(() => goTo(currentSection - 1), [currentSection, goTo])
  const goDown = useCallback(() => goTo(currentSection + 1), [currentSection, goTo])

  // Wheel navigation — only change section when scrolled to top/bottom
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const section = document.querySelector('.fullpage-section') as HTMLElement | null
      if (!section) return
      // Check the section itself AND any scrollable child
      // Also verify computed overflow-y is actually scrollable (not 'visible')
      const scrollableCandidate = section.querySelector('.overflow-y-auto') as HTMLElement | null
      const isActuallyScrollable = scrollableCandidate &&
        scrollableCandidate.scrollHeight > scrollableCandidate.clientHeight &&
        (() => { const oy = window.getComputedStyle(scrollableCandidate).overflowY; return oy === 'auto' || oy === 'scroll' })()
      // Only gate on scroll position when there's a genuinely scrollable child
      if (isActuallyScrollable && scrollableCandidate) {
        const atTop = scrollableCandidate.scrollTop <= 5
        const atBottom = scrollableCandidate.scrollHeight - scrollableCandidate.scrollTop - scrollableCandidate.clientHeight <= 5
        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return // let content scroll
      }
      e.preventDefault()
      if (isAnimating.current) return
      if (e.deltaY > 30) goDown()
      else if (e.deltaY < -30) goUp()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goUp, goDown])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goDown() }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goUp() }
      if (e.key === 'Home') { e.preventDefault(); goTo(0) }
      if (e.key === 'End') { e.preventDefault(); goTo(TOTAL - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goUp, goDown, goTo])

  const variants = {
    enter: { opacity: 0, scale: 0.97 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
  }

  const sections = [
    <Home
      key="home"
      navigation={
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm sm:max-w-md">
          {([
            { icon: 'pi-list',     label: 'Nasza oferta',  sub: 'Dlaczego my?',           idx: 1 },
            { icon: 'pi-shopping-bag', label: 'Produkty',  sub: 'Łóżka rehabilitacyjne',  idx: 2 },
            { icon: 'pi-phone',   label: 'Kontakt',        sub: 'Napisz lub zadzwoń',     idx: 3 },
            { icon: 'pi-comments', label: 'Opinie',        sub: 'Co mówią klienci',       idx: 4 },
          ] as const).map(({ icon, label, sub, idx }) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="group flex flex-col items-center gap-1 sm:gap-1.5 p-3 sm:p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-sky-500/10 hover:border-sky-400/30 hover:shadow-[0_0_24px_rgba(56,189,248,0.1)] transition-all duration-200 cursor-pointer"
            >
              <i className={`pi ${icon} text-sky-400 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-white font-semibold text-sm sm:text-base leading-tight">{label}</span>
              <span className="text-gray-500 text-xs hidden sm:block">{sub}</span>
            </button>
          ))}
        </div>
      }
    />,
    <Features
      key="features"
      navigation={
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <button onClick={() => goTo(0)} className="btn-primary-outline">
            <i className="pi pi-info-circle" /> O nas
          </button>
          <button onClick={() => goTo(3)} className="btn-primary">
            <i className="pi pi-phone" /> Skontaktuj się z nami
          </button>
          <button onClick={() => goTo(2)} className="btn-primary-outline">
            <i className="pi pi-objects-column" /> Zobacz nasze produkty
          </button>
        </div>
      }
    />,
    <Products key="products" />,
    <Contact key="contact" />,
    <Reviews key="reviews" />,
  ]

  return (
    <>
      {/* Right-side navigation panel — desktop only, touch handles mobile */}
      <div className="hidden sm:flex fixed z-[9999] right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <button
          onClick={goUp}
          className={`nav-arrow group transition-opacity duration-300 ${currentSection === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <i className="pi pi-chevron-up text-base group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {SECTION_IDS.map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            title={label}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentSection === i
                ? 'bg-sky-400 scale-125 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                : 'bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}

        <button
          onClick={goDown}
          className={`nav-arrow group animate-bounce-slow transition-opacity duration-300 ${currentSection >= TOTAL - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <i className="pi pi-chevron-down text-base group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile bottom navigation bar */}
      <div className="sm:hidden fixed z-[9999] bottom-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-md border-t border-white/10 flex items-center px-3 py-2 gap-2">
        <button
          onClick={goUp}
          disabled={currentSection === 0}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm disabled:opacity-25 disabled:cursor-not-allowed active:bg-white/15 transition-colors min-w-[88px] justify-center"
        >
          <i className="pi pi-chevron-left text-sky-400" />
          Wstecz
        </button>

        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-white font-bold text-sm leading-tight">
            {SECTION_LABELS[SECTION_IDS[currentSection]]}
          </span>
          <span className="text-gray-500 text-xs">{currentSection + 1}&nbsp;/&nbsp;{TOTAL}</span>
        </div>

        <button
          onClick={goDown}
          disabled={currentSection >= TOTAL - 1}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm disabled:opacity-25 disabled:cursor-not-allowed active:bg-white/15 transition-colors min-w-[88px] justify-center"
        >
          Dalej
          <i className="pi pi-chevron-right text-sky-400" />
        </button>
      </div>

      {/* Fullpage Motion container */}
      <div className="fullpage-container">
        <AnimatePresence initial={false} mode="wait">
          <motion.section
            key={currentSection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fullpage-section"
          >
            {sections[currentSection]}
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  )
}
