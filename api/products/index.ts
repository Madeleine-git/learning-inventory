import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      const products = await sql`
        SELECT 
          p.id,
          p.name AS curso,
          p.price AS precio,
          p.stock AS plazas,
          p.duration AS duracion,
          p.level AS nivel,
          p.rating AS valoracion,
          p.image_url AS imagen,
          c.name AS categoria
        FROM products p
        INNER JOIN categories c ON p.category_id = c.id
        ORDER BY c.name, p.name
      `;
      res.status(200).json(products);
    } catch {
      res.status(500).json({ error: 'Error al obtener los cursos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}