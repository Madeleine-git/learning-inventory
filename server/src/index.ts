import 'dotenv/config';
import express from 'express';
import productsRouter from './routes/products.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});