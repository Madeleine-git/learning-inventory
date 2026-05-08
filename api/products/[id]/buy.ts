import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);

  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const { nombre, email } = req.body;

      // Restar una plaza
      const result = await sql`
        UPDATE products
        SET stock = stock - 1
        WHERE id = ${id as string} AND stock > 0
        RETURNING *
      `;

      if (result.length === 0) {
        res.status(400).json({ error: 'No hay plazas disponibles' });
        return;
      }

      // Guardar la matrícula
      await sql`
        INSERT INTO enrollments (nombre, email, product_id)
        VALUES (${nombre}, ${email}, ${id as string})
      `;

      res.status(200).json(result[0]);
    } catch {
      res.status(500).json({ error: 'Error al procesar la compra' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}