import { useState, useEffect, type ReactNode } from 'react'

interface HomeProps {
  navigation?: ReactNode
}

export default function Home({ navigation }: HomeProps) {
  const phoneNumber = '+48123123123'
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

  function copyPhoneNumber() {
    navigator.clipboard.writeText('+48 123 123 123')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="no-scrollbar relative flex flex-col items-center justify-center w-full h-full px-4 gap-8 sm:gap-10 overflow-y-auto sm:overflow-visible py-8 pb-24 sm:pb-10">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />

      <img
        className="relative w-[160px] h-[160px] sm:w-[260px] sm:h-[260px] drop-shadow-[0_0_60px_rgba(56,189,248,0.15)]"
        src="/medical_bed.png"
        alt="Łóżka Rehabilitacyjne"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl sm:text-8xl font-extrabold bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
          Łukasz Skrond
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-xl">
          Sprzedaż łóżek rehabilitacyjnych do opieki długoterminowej
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        {isMobile ? (
          <>
            <p className="text-2xl text-gray-300">Zadzwoń:</p>
            <a
              href={`tel:${phoneNumber}`}
              className="font-bold text-3xl sm:text-4xl text-sky-400 hover:text-sky-300 transition-colors"
            >
              +48 123 123 123
            </a>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">(Kliknij numer telefonu aby skopiować do schowka!)</p>
            <button
              onClick={copyPhoneNumber}
              className="font-bold cursor-pointer text-3xl sm:text-5xl text-white hover:text-sky-400 focus:outline-none transition-colors duration-200"
            >
              +48 123 123 123
            </button>
            {copied && (
              <span className="text-sm text-emerald-400 animate-fade-in">
                <i className="pi pi-check mr-1" />Skopiowano do schowka!
              </span>
            )}
          </>
        )}
      </div>

      {navigation}
    </div>
  )
}
