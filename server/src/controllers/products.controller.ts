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
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};