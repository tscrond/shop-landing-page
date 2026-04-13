import type { IDatabase } from './types.js'

export type { IDatabase, ProductRow, ProductInsertData } from './types.js'

let _instance: IDatabase | null = null

/**
 * Initialise the database provider selected by the DB_PROVIDER env var.
 *
 * DB_PROVIDER=postgres  (default) — requires DATABASE_URL
 * DB_PROVIDER=firestore            — uses Application Default Credentials
 * DB_PROVIDER=memory               — in-memory, no external dependency, resets on restart
 */
export async function initDatabase(): Promise<void> {
  const provider = (process.env.DB_PROVIDER ?? 'postgres').toLowerCase()

  if (provider === 'firestore') {
    const { FirestoreDatabase } = await import('./firestore.js')
    _instance = new FirestoreDatabase()
  } else if (provider === 'memory') {
    const { MemoryDatabase } = await import('./memory.js')
    _instance = new MemoryDatabase()
  } else {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is required when DB_PROVIDER=postgres.')
    const { PostgresDatabase } = await import('./postgres.js')
    _instance = new PostgresDatabase(url)
  }

  await _instance.init()
}

/** Returns the initialised database instance. Must call initDatabase() first. */
export function getDatabase(): IDatabase {
  if (!_instance) throw new Error('Database not initialised — call initDatabase() before use.')
  return _instance
}
