import type { ProductInsertData } from './types.js'

export const DEFAULT_PRODUCTS: ProductInsertData[] = [
  { name: 'Stiegelmeyer — łóżko nowe',    description: 'Fabrycznie nowe łóżko rehabilitacyjne firmy Stiegelmeyer do opieki długoterminowej. Elektryczna regulacja wysokości, oparcia pleców i podnóżka. Solidna konstrukcja z certyfikatem CE.', badge: 'Nowe',    badgeColor: 'bg-emerald-500', imageUrl: null },
  { name: 'Vermeiren — łóżko nowe',       description: 'Nowe łóżko rehabilitacyjne Vermeiren z pilotem sterującym. Idealne do opieki domowej i placówek opiekuńczych. Regulacja wszystkich segmentów, łatwe w obsłudze.',                  badge: 'Nowe',    badgeColor: 'bg-emerald-500', imageUrl: null },
  { name: 'Burmeier — łóżko nowe',        description: 'Łóżko rehabilitacyjne Burmeier — niemiecka jakość i niezawodność. Elektryczna regulacja, system zabezpieczeń i estetyczny design pasujący do wnętrza domowego.',                  badge: 'Nowe',    badgeColor: 'bg-emerald-500', imageUrl: null },
  { name: 'Stiegelmeyer — łóżko używane', description: 'Używane łóżko rehabilitacyjne Stiegelmeyer w bardzo dobrym stanie technicznym. Objęte gwarancją, serwisowane i gotowe do natychmiastowej dostawy.',                               badge: 'Używane', badgeColor: 'bg-amber-500',   imageUrl: null },
  { name: 'Vermeiren — łóżko używane',    description: 'Łóżko używane Vermeiren po pełnym przeglądzie technicznym. Pełna sprawność wszystkich funkcji elektrycznych. Gwarancja i transport w cenie.',                                     badge: 'Używane', badgeColor: 'bg-amber-500',   imageUrl: null },
  { name: 'Burmeier — łóżko używane',     description: 'Używane łóżko Burmeier — dokładnie sprawdzone i przygotowane do użytku. Doskonała opcja w atrakcyjnej cenie z możliwością negocjacji.',                                           badge: 'Używane', badgeColor: 'bg-amber-500',   imageUrl: null },
]
