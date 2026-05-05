# Arquitectura de datos — Learning Inventory

## ¿Qué significa que `category_id` sea una Foreign Key?

La tabla `products` tiene un campo `category_id` que no es un dato
inventado: debe coincidir con un `id` que exista en la tabla `categories`.

Esto establece una relación formal entre las dos tablas:
- Una categoría puede tener muchos productos (relación 1 a N)
- Un producto pertenece a exactamente una categoría
- La base de datos rechaza automáticamente cualquier producto
  que intente referenciar una categoría inexistente

Es el "pegamento" que conecta ambas tablas y garantiza
que los datos sean siempre coherentes.

## `ON DELETE CASCADE` vs `ON DELETE RESTRICT`

### ¿Qué ocurre cuando intentamos borrar una categoría que tiene productos asociados?

| Comportamiento | Qué hace | ¿Es seguro? |
|---|---|---|
| `CASCADE` | Borra la categoría **y todos sus productos** | ⚠️ Peligroso |
| `RESTRICT` | Rechaza el borrado si hay productos asociados | ✅ Seguro |

### ¿Por qué `RESTRICT` es más seguro en este caso?

En un sistema de inventario, los productos son datos críticos
de negocio. Borrar accidentalmente una categoría no debería
llevarse por delante todos los productos asociados.

Con `RESTRICT`, la base de datos te obliga a tomar una
decisión explícita antes de borrar:
- ¿Quiero reasignar los productos a otra categoría?
- ¿Quiero borrarlos manualmente uno a uno?

Esto evita pérdidas de datos accidentales e irreversibles.

### ¿Cuándo usaría `CASCADE`?

Cuando los datos hijos no tienen sentido sin el padre.
Por ejemplo: los comentarios de un post, o los items de un carrito de compra. Si se borra el post, borrar sus comentarios es lógico.

En nuestro caso, un producto sí tiene sentido aunque su categoría desaparezca — por eso `RESTRICT` es la elección correcta.