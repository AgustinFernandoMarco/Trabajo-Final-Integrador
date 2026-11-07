# CelularesVR · Trabajo Final Integrador (Programación II)

Sistema web para una tienda de celulares: base de
datos PostgreSQL en Supabase, API en Node + Express (en capas) y front en JavaScript vanilla.
Instituto Superior Villa del Rosario · Tecnicatura Superior en Desarrollo de Software · Ciclo 2026.

## Integrantes y funcionalidades

| Santino | Nuevo pedido: catálogo, clientes y `usp_Pedidos_Crear` |
`index.html` | `rama-pedido-santino` |
| Agus | Tablero: listado con JOIN y búsqueda con filtros | `tablero.html` |
`rama-tablero-agus` |
| Marlumile | Estadísticas (GROUP BY) y cambio de estado |
`estadisticas.html` | `rama-estadisticas-marlumile` y `rama-estado-marlumile`
|


## Cómo levantar el sistema desde cero

1. Ejecutar `db/script.sql` en el SQL Editor de Supabase (se puede correr más
de una vez). La versión original para SQL Server está en
`db/script.sqlserver.sql`.
2. `cd bak` y `npm install`
3. Copiar `env.ejemplo` como `.env` y completar los datos de conexión de
Supabase (Connect, Session pooler).
4. `npm start` y abrir <http://localhost:3000>

## Estructura

```
bak/   back (Node + Express): config / middlewares / services / controllers / routes
fron/  front (HTML + ES Modules + componentes + CSS propio)
db/    script.sql
docs/  DER_CelularesVR.png
```

## API (contrato del grupo)

| Método | Ruta | Descripción | Procedimiento | Responsable | Estado |
|---|---|---|---|---|---|
| GET | `/api/pedidos` | Listado con JOIN | `usp_Pedidos_Listar` | B | ✅ base |
| GET | `/api/pedidos/buscar?texto=&estado=&desde=&hasta=` | Búsqueda con filtros | `usp_Pedidos_Buscar` | B | ⏳ |
| GET | `/api/pedidos/:id` | Detalle de un pedido | `usp_Pedidos_Obtener` | D | ⏳ |
| POST | `/api/pedidos` | Crear pedido (`{ clienteId, detalle:[{productoId,cantidad}] }`) → `201 { pedidoId }` | `usp_Pedidos_Crear` | A | ⏳ |
| PATCH | `/api/pedidos/:id/estado` | Cambiar estado (`{ estado }`) | `usp_Pedidos_CambiarEstado` | D | ⏳ |
| GET | `/api/productos?categoriaId=` | Catálogo | `usp_Productos_Listar` | A | ⏳ |
| GET | `/api/categorias` | Categorías | `usp_Categorias_Listar` | A | ⏳ |
| GET | `/api/clientes` | Clientes | `usp_Clientes_Listar` | A | ⏳ |
| GET | `/api/estadisticas/ventas-por-categoria` | Ventas por categoría | `usp_Estadisticas_VentasPorCategoria` | C | ⏳ |

### Errores

| Código SQL | HTTP | Significado |
|---|---|---|
| P0001 | 400 | Pedido sin renglones válidos |
| P0002 | 400 | Producto inexistente o inactivo |
| P0003 | 400 | Stock insuficiente |
| P0004 | 404 | Pedido no encontrado |
| P0005 | 400 | Transición de estado inválida |
| P0006 | 404 | Cliente no encontrado |

## Flujo de trabajo con Git

- `main` siempre funciona: nadie programa directo en `main`.
- Cada funcionalidad en su rama (`rama-<funcionalidad>-<nombre>`) y entra a `main` por Pull Request revisado por otro integrante.
- Commits chicos y con mensajes claros, repartidos entre todos.
