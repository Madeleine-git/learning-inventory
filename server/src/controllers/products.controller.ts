import { Request, Response } from 'express';
import sql from '../../../src/lib/db';

// GET - obtener todos los cursos con su categoría
export const getProducts = async (req: Request, res: Response) => {
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
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};

// POST - insertar un curso nuevo con consulta parametrizada
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category_id } = req.body;
    const result = await sql`
      INSERT INTO products (name, price, stock, category_id)
      VALUES (${name}, ${price}, ${stock}, ${category_id})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch {
    res.status(500).json({ error: 'Error al crear el curso' });
  }
};

// POST - comprar un curso (restar una plaza y guardar matrícula)
export const buyProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    const result = await sql`
      UPDATE products
      SET stock = stock - 1
      WHERE id = ${id} AND stock > 0
      RETURNING *
    `;

    if (result.length === 0) {
      res.status(400).json({ error: 'No hay plazas disponibles' });
      return;
    }

    await sql`
      INSERT INTO enrollments (nombre, email, product_id)
      VALUES (${nombre}, ${email}, ${id})
    `;

    res.json(result[0]);
  } catch {
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};