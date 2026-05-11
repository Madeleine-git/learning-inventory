# 📚 Learning Inventory

### La plataforma para gestionar y vender cursos online

Aplicación fullstack de inventario de cursos online con base de datos PostgreSQL en Neon, backend Express y frontend React con diseño moderno.

## Despliegue

| | URL |
|---|---|
| **Frontend** | [learning-inventory-nine.vercel.app](https://learning-inventory-nine.vercel.app) |

## Características

1. Catálogo de cursos con imágenes, valoraciones, duración y nivel
2. Sistema de matriculación con formulario y descuento de plazas en tiempo real
3. Filtrado por categorías y modo oscuro
4. Base de datos PostgreSQL real en Neon con consultas seguras parametrizadas
5. Login de prueba con gestión de sesión en frontend

## Cómo funciona

1. **Los datos viven en Neon** — base de datos PostgreSQL en la nube con las tablas `categories` y `products`
2. **El frontend pide los datos** — React hace una petición a `/api/products` al cargar la página
3. **Vercel recibe la petición** — la redirige al archivo `api/products/index.ts`
4. **La API Route consulta Neon** — el driver `@neondatabase/serverless` ejecuta un `SELECT` con `INNER JOIN`
5. **Los datos llegan a pantalla** — Neon → API Route → React → usuario
6. **Al matricularse** — el botón llama a `/api/products/:id/buy` que ejecuta un `UPDATE` en Neon restando una plaza

## Arquitectura del sistema

La aplicación tiene tres capas separadas que trabajan juntas:

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| **Frontend** | React + Vercel | Interfaz de usuario — muestra los datos |
| **API** | Vercel API Routes | Intermediario — conecta frontend con base de datos |
| **Base de datos** | Neon (PostgreSQL) | Almacenamiento permanente de datos |

### Flujo de datos

**Al cargar la app:**
1. El frontend hace una petición `GET /api/products`
2. La API consulta Neon con un `SELECT` + `INNER JOIN`
3. Neon devuelve los cursos
4. El frontend los muestra en pantalla

**Al matricularse:**
1. El frontend envía nombre, email e ID del curso a `POST /api/buy`
2. La API ejecuta dos operaciones en Neon:
   - `UPDATE products SET stock = stock - 1`
   - `INSERT INTO enrollments`
3. Los datos quedan guardados permanentemente en Neon

### Ventaja de esta arquitectura

Los datos viven en Neon independientemente del código. Esto significa que puedes añadir, editar o borrar cursos directamente desde el SQL Editor de Neon sin necesidad de tocar el código ni redesplegar en Vercel.

## Tecnologías

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | Librería de interfaz de usuario |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos y diseño |
| Vite | Bundler y servidor de desarrollo |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express | Framework de servidor HTTP |
| @neondatabase/serverless | Driver de conexión a PostgreSQL |
| Vercel API Routes | Endpoints en producción |

### Auxiliares
| Tecnología | Uso |
|---|---|
| Neon | Base de datos PostgreSQL serverless |
| Vercel | Despliegue del frontend y API |
| GitHub | Control de versiones |

## ## Estructura del proyecto

```
learning-inventory/
├── api/                            # Vercel API Routes (producción)
│   ├── buy.ts                      # POST /api/buy — matrícula y descuento de plazas
│   └── products/
│       └── index.ts                # GET /api/products — listado de cursos
├── server/                         # Backend Express (desarrollo local)
│   └── src/
│       ├── index.ts                # Punto de entrada del servidor
│       ├── routes/
│       │   └── products.routes.ts  # Definición de rutas
│       └── controllers/
│           └── products.controller.ts  # Lógica de negocio
├── src/                            # Frontend React
│   ├── components/
│   │   └── ProductList.tsx         # Componente principal
│   ├── lib/
│   │   ├── db.ts                   # Cliente de base de datos
│   │   ├── drizzle.ts              # Cliente Drizzle ORM
│   │   ├── drizzle-query.ts        # Consulta tipada con Drizzle
│   │   └── schema.ts               # Esquema Drizzle en TypeScript
│   ├── App.tsx                     # Componente raíz
│   └── main.tsx                    # Punto de entrada
├── sql/                            # Scripts de base de datos
│   ├── schema.sql                  # Definición de tablas
│   └── seed.sql                    # Datos iniciales
├── docs/                           # Documentación técnica
│   ├── arquitectura-datos.md       # Foreign keys y modelo relacional
│   ├── analisis-sql.md             # INNER JOIN vs LEFT JOIN
│   └── seguridad-db.md             # Inyección SQL y consultas parametrizadas
├── index.html                      # HTML principal
├── vite.config.ts                  # Configuración de Vite
├── vercel.json                     # Configuración de despliegue
└── README.md
```

## Descargar y ejecutar

```bash
git clone https://github.com/Madeleine-git/learning-inventory.git
cd learning-inventory
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
DATABASE_URL="tu_connection_string_de_neon"
```

### Ejecutar en local

En una terminal arranca el backend:

```bash
npx tsx --env-file=.env.local server/src/index.ts
```

En otra terminal arranca el frontend:

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Desplegar en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Añade la variable de entorno `DATABASE_URL` con tu connection string de Neon
3. Vercel detecta automáticamente la configuración de Vite
4. Haz clic en **Deploy**

## Base de datos

### Esquema
Ejecuta `sql/schema.sql` en el SQL Editor de Neon para crear las tablas `categories` y `products`.

### Datos iniciales
Ejecuta `sql/seed.sql` para poblar la base de datos con categorías y cursos de ejemplo.

## ORM Tipado — Drizzle ORM

### ¿Por qué usar un ORM en proyectos grandes?

Escribir SQL puro es fundamental para entender los cimientos de las bases de datos. Sin embargo, en proyectos grandes con muchas tablas y equipos de varias personas, los ORMs tipados como Drizzle ofrecen ventajas clave:

| Sin ORM (SQL puro) | Con Drizzle ORM |
|---|---|
| Strings de SQL sin verificar | TypeScript verifica los nombres de columnas |
| Errores en tiempo de ejecución | Errores detectados mientras escribes |
| Refactorizar es arriesgado | TypeScript avisa en todos los sitios afectados |
| Más control en consultas complejas | Más seguro en proyectos con muchas tablas |

### Esquema en TypeScript

```typescript
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 150 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  categoryId: uuid('category_id').notNull(),
});
```

### Consulta equivalente al INNER JOIN

SQL puro:
```sql
SELECT p.name, p.price, c.name
FROM products p
INNER JOIN categories c ON p.category_id = c.id
```

Con Drizzle ORM:
```typescript
const result = await db
  .select({ curso: products.name, precio: products.price, categoria: categories.name })
  .from(products)
  .innerJoin(categories, eq(products.categoryId, categories.id));
```

El resultado es idéntico, pero Drizzle garantiza en tiempo de compilación que los nombres de tablas y columnas son correctos.
---

Desarrollado durante las prácticas en Corner Estudios — Madeleine Urrego — 2026