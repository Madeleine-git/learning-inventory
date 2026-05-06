import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products.controller';

const router = Router();

// GET - obtener todos los cursos con su categoría
router.get('/', getProducts);

// POST - insertar un curso nuevo
router.post('/', createProduct);

export default router;