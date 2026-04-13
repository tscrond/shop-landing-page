import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import Home from '../components/sections/Home'
import Features from '../components/sections/Features'
import Products from '../components/sections/Products'
import Contact from '../components/sections/Contact'

const SECTION_IDS = ['home', 'features', 'products', 'contact'] as const
const TOTAL = SECTION_IDS.length

export default function HomeView() {
  const [currentSection, setCurrentSection] = useState(0)
  const [_, setDirection] = useState(0) // -1 up, 1 down
  const [isMobile, setIsMobile] = useState(false)
  const isAnimating = useRef(false)
  const touchStartY = useRef(0)

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL || index === currentSection || isAnimating.current) return
    setDirection(index > currentSection ? 1 : -1)
    setCurrentSection(index)
    isAnimating.current = true
    setTimeout(() => { isAnimating.current = false }, 700)
  }, [currentSection])

  const goUp = useCallback(() => goTo(currentSection - 1), [currentSection, goTo])
  const goDown = useCallback(() => goTo(currentSection + 1), [currentSection, goTo])

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Wheel navigation — only change section when scrolled to top/bottom
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const section = document.querySelector('.fullpage-section') as HTMLElement | null
      if (!section) return
      // Check the section itself AND any scrollable child
      const scrollable = section.querySelector('.overflow-y-auto') as HTMLElement | null
      const el = scrollable && scrollable.scrollHeight > scrollable.clientHeight ? scrollable : section
      const atTop = el.scrollTop <= 5
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 5
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return // let content scroll
      e.preventDefault()
      if (isAnimating.current) return
      if (e.deltaY > 30) goDown()
      else if (e.deltaY < -30) goUp()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goUp, goDown])

  // Touch navigation — only change section when scrolled to top/bottom
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return
      const delta = touchStartY.current - e.changedTouches[0].clientY
      const section = document.querySelector('.fullpage-section') as HTMLElement | null
      if (!section) return
      const scrollable = section.querySelector('.overflow-y-auto') as HTMLElement | null
      const el = scrollable && scrollable.scrollHeight > scrollable.clientHeight ? scrollable : section
      const atTop = el.scrollTop <= 5
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 5
      if (delta > 50 && atBottom) goDown()
      else if (delta < -50 && atTop) goUp()
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
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
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => goTo(1)} className="btn-primary">
            <i className="pi pi-arrow-down" /> Nasza oferta
          </button>
          <button onClick={() => goTo(3)} className="btn-primary-outline">
            <i className="pi pi-phone" /> Skontaktuj się z nami
          </button>
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
  ]

  return (
    <>
      {/* Navigation arrows */}
      {currentSection > 0 && (
        <div className={`fixed z-[9999] ${isMobile ? 'top-4 right-4' : 'top-6 left-1/2 -translate-x-1/2'}`}>
          <button onClick={goUp} className="nav-arrow group">
            <i className="pi pi-chevron-up text-lg group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {currentSection < TOTAL - 1 && (
        <div className={`fixed z-[9999] ${isMobile ? 'bottom-4 right-4' : 'bottom-6 left-1/2 -translate-x-1/2'}`}>
          <button onClick={goDown} className="nav-arrow group animate-bounce-slow">
            <i className="pi pi-chevron-down text-lg group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Section dots indicator */}
      <div className={`fixed z-[9999] right-6 top-1/2 -translate-y-1/2 flex-col gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
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
