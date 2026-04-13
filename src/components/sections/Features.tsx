import type { ReactNode } from 'react'

interface FeaturesProps {
  navigation?: ReactNode
}

const features = [
  {
    title: 'Łóżka renomowanych firm',
    text: 'Sprzedajemy łóżka rehabilitacyjne marek Stiegelmeyer, Vermeiren oraz Burmeier — sprawdzonych producentów sprzętu do opieki długoterminowej.',
    icon: 'pi pi-verified',
    color: 'from-sky-500/20 to-sky-500/5',
    iconColor: 'text-sky-400',
  },
  {
    title: 'Nowe i używane z gwarancją',
    text: 'W ofercie posiadamy zarówno łóżka fabrycznie nowe, jak i używane objęte gwarancją. Każde łóżko jest dokładnie sprawdzone przed sprzedażą.',
    icon: 'pi pi-shopping-cart',
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Transport i montaż',
    text: 'Zapewniamy transport oraz profesjonalny montaż łóżka bezpośrednio u klienta — w cenie usługi.',
    icon: 'pi pi-truck',
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Faktura VAT',
    text: 'Do każdego zamówienia wystawiamy fakturę VAT. Możliwość rozliczenia zakupu przez instytucje i osoby prywatne.',
    icon: 'pi pi-file',
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Skup łóżek rehabilitacyjnych',
    text: 'Oferujemy skup używanych łóżek rehabilitacyjnych. Skontaktuj się z nami, aby uzyskać wycenę.',
    icon: 'pi pi-sync',
    color: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-400',
  },
  {
    title: 'Dostępność od ręki',
    text: 'Wiele modeli łóżek dostępnych od ręki — bez długiego oczekiwania. Możliwość negocjacji cen przy każdym zamówieniu.',
    icon: 'pi pi-bolt',
    color: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-400',
  }
]

export default function Features({ navigation }: FeaturesProps) {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-full">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[10%] right-[-5%] w-[350px] h-[350px] bg-sky-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-violet-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center w-full px-4 py-8 overflow-y-auto max-h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl w-full">
          <div className="col-span-1 md:col-span-3 text-center mb-4">
            <h1 className="text-4xl font-extrabold text-white mb-2">Co oferujemy?</h1>
            <p className="text-gray-400">Kompleksowa obsługa od zakupu po montaż</p>
          </div>

          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-white/10 bg-gradient-to-br ${f.color} p-3 sm:p-6 flex flex-col gap-1.5 sm:gap-3 hover:border-white/20 hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center ${f.iconColor}`}>
                <i className={f.icon} style={{ fontSize: 14 }} />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
        {navigation}
      </div>
    </div>
  )
}
