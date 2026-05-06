# Auditoría de seguridad — Learning Inventory

## ¿Qué es una inyección SQL?

Es un ataque donde el usuario introduce código SQL malicioso a través de un campo de la aplicación, manipulando la consulta que se ejecuta en la base de datos.

### Ejemplo vulnerable

```javascript
const name = req.body.name; // atacante escribe: "'; DROP TABLE products;--"
const query = "SELECT * FROM products WHERE name = '" + name + "'";
```

La consulta resultante sería:
```sql
SELECT * FROM products WHERE name = ''; DROP TABLE products;--'
```

Esto borraría toda la tabla products.

## ¿Cómo lo hemos prevenido?

Usando consultas parametrizadas con el driver `@neondatabase/serverless`.
La consulta y los datos viajan por canales separados — el driver
trata los datos del usuario siempre como texto, nunca como código SQL.

### Ejemplo seguro — GET

```typescript
const products = await sql`
  SELECT p.name, p.price, c.name AS categoria
  FROM products p
  INNER JOIN categories c ON p.category_id = c.id
`;
```

### Ejemplo seguro — POST

```typescript
const { name, price, stock, category_id } = req.body;

const result = await sql`
  INSERT INTO products (name, price, stock, category_id)
  VALUES (${name}, ${price}, ${stock}, ${category_id})
  RETURNING *
`;
```

Los valores entre `${}` son tratados como parámetros seguros,
nunca como parte de la instrucción SQL.

## Conclusión

| Enfoque | Seguro | Por qué |
|---|---|---|
| Concatenación de strings | ❌ | El usuario puede inyectar código SQL |
| Consultas parametrizadas | ✅ | Los datos nunca se interpretan como código |