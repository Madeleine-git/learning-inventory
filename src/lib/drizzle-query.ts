import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products, categories } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Consulta con Drizzle — equivalente al INNER JOIN que hicimos en SQL puro
export async function getProductsWithCategory() {
  const result = await db
    .select({
      id: products.id,
      curso: products.name,
      precio: products.price,
      plazas: products.stock,
      categoria: categories.name,
      duracion: products.duration,
      nivel: products.level,
      valoracion: products.rating,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  return result;
}