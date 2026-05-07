import { pgTable, uuid, varchar, numeric, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 150 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  categoryId: uuid('category_id').notNull(),
  duration: varchar('duration', { length: 50 }),
  level: varchar('level', { length: 20 }),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});