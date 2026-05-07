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

## Estructura del proyecto

```
learning-inventory/
├── api/                            # Vercel API Routes (producción)
│   └── products/
│       ├── index.ts                # GET /api/products
│       └── [id]/
│           └── buy.ts              # POST /api/products/:id/buy
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
│   │   └── db.ts                   # Cliente de base de datos
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

---

Desarrollado durante las prácticas en Corner Estudios — Madeleine Urrego — 2026