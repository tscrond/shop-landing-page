import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  description: text('description').notNull(),
  badge:       text('badge').notNull(),
  badgeColor:  text('badge_color').notNull(),
  imageUrl:    text('image_url'),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const reviews = pgTable('reviews', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  description: text('description').notNull(),
  rating:      integer('rating').notNull(),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})


export type ProductInsert = typeof products.$inferInsert
export type ProductSelect = typeof products.$inferSelect
export type ReviewInsert = typeof reviews.$inferInsert
export type ReviewSelect = typeof reviews.$inferSelect

