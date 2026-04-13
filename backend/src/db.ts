import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.js'
import { products } from './schema.js'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.')
}

const client = postgres(DATABASE_URL, { max: 10 })
export const db = drizzle(client, { schema })

export async function initDb() {
  // Create table if it doesn't exist (mirrors the schema definition)
  await client`
    CREATE TABLE IF NOT EXISTS products (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT        NOT NULL,
      description TEXT        NOT NULL,
      badge       TEXT        NOT NULL,
      badge_color TEXT        NOT NULL,
      image_url   TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // Migrate: add image_url if table existed before this column was introduced
  await client`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT
  `

  // Seed default products if table is empty
  const existing = await db.select({ id: products.id }).from(products).limit(1)
  if (existing.length === 0) {
    await db.insert(products).values([
      { name: 'Stiegelmeyer — łóżko nowe',    description: 'Fabrycznie nowe łóżko rehabilitacyjne firmy Stiegelmeyer do opieki długoterminowej. Elektryczna regulacja wysokości, oparcia pleców i podnóżka. Solidna konstrukcja z certyfikatem CE.', badge: 'Nowe',    badgeColor: 'bg-emerald-500' },
      { name: 'Vermeiren — łóżko nowe',       description: 'Nowe łóżko rehabilitacyjne Vermeiren z pilotem sterującym. Idealne do opieki domowej i placówek opiekuńczych. Regulacja wszystkich segmentów, łatwe w obsłudze.',                  badge: 'Nowe',    badgeColor: 'bg-emerald-500' },
      { name: 'Burmeier — łóżko nowe',        description: 'Łóżko rehabilitacyjne Burmeier — niemiecka jakość i niezawodność. Elektryczna regulacja, system zabezpieczeń i estetyczny design pasujący do wnętrza domowego.',                  badge: 'Nowe',    badgeColor: 'bg-emerald-500' },
      { name: 'Stiegelmeyer — łóżko używane', description: 'Używane łóżko rehabilitacyjne Stiegelmeyer w bardzo dobrym stanie technicznym. Objęte gwarancją, serwisowane i gotowe do natychmiastowej dostawy.',                               badge: 'Używane', badgeColor: 'bg-amber-500'   },
      { name: 'Vermeiren — łóżko używane',    description: 'Łóżko używane Vermeiren po pełnym przeglądzie technicznym. Pełna sprawność wszystkich funkcji elektrycznych. Gwarancja i transport w cenie.',                                     badge: 'Używane', badgeColor: 'bg-amber-500'   },
      { name: 'Burmeier — łóżko używane',     description: 'Używane łóżko Burmeier — dokładnie sprawdzone i przygotowane do użytku. Doskonała opcja w atrakcyjnej cenie z możliwością negocjacji.',                                           badge: 'Używane', badgeColor: 'bg-amber-500'   },
    ])
  }
}

