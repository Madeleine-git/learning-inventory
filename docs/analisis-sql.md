# Análisis SQL — Learning Inventory

## Diferencia entre INNER JOIN y LEFT JOIN

### INNER JOIN

Devuelve **solo las filas que tienen coincidencia en ambas tablas**.
Si un registro no tiene relación en la otra tabla, no aparece.

**Escenario real:**
Una plataforma de cursos quiere mostrar únicamente las categorías
que tienen al menos un curso publicado. Las categorías vacías
no interesan porque no hay nada que mostrar al usuario.

```sql
SELECT c.name AS categoria, p.name AS curso
FROM categories c
INNER JOIN products p ON c.id = p.category_id;
```

Resultado: Solo aparecen Programación y Diseño.
Marketing no aparece porque no tiene cursos.

---

### LEFT JOIN

Devuelve **todas las filas de la tabla izquierda**, tengan o no
coincidencia en la tabla derecha. Si no hay coincidencia,
los campos de la derecha aparecen como NULL.

**Escenario real:**
El administrador de la plataforma quiere ver TODAS las categorías,
incluso las que están vacías, para saber cuáles necesitan
nuevos cursos.

```sql
SELECT c.name AS categoria, COUNT(p.id) AS total_cursos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name;
```

Resultado: Aparecen Programación (2), Diseño (2) y Marketing (0).
Marketing aparece con 0 porque el LEFT JOIN incluye todas
las categorías aunque no tengan cursos.

---

### Resumen

| | INNER JOIN | LEFT JOIN |
|---|---|---|
| ¿Qué devuelve? | Solo coincidencias | Todos los de la izquierda |
| ¿Categorías vacías? | No aparecen | Aparecen con 0 o NULL |
| ¿Cuándo usarlo? | Cuando solo interesan datos completos | Cuando necesitas ver todo aunque falten datos |