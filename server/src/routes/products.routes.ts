import { Router } from 'express';
import { getProducts, createProduct, buyProduct } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/:id/buy', buyProduct);

export default router;