# CelularesVR · Trabajo Final Integrador (Programación II)

Sistema web para una tienda de celulares: base de datos SQL Server, API en Node + Express (en capas) y front en JavaScript vanilla.
Instituto Superior Villa del Rosario · Tecnicatura Superior en Desarrollo de Software · Ciclo 2026.

## Integrantes y funcionalidades

| Integrante | Funcionalidad (de punta a punta) | Pantalla | Rama |
|---|---|---|---|
| _Nombre A_ | Nuevo pedido: catálogo, clientes y `usp_Pedidos_Crear` | `index.html` | `rama-pedido-nombre` |
| _Nombre B_ | Tablero: listado con JOIN y búsqueda con filtros | `tablero.html` | `rama-tablero-nombre` |
| _Nombre C_ | Estadísticas: ventas por categoría (GROUP BY) | `estadisticas.html` | `rama-estadisticas-nombre` |
| _Nombre D_ | Detalle de pedido y cambio de estado | `pedido.html` | `rama-estado-nombre` |

## Cómo levantar el sistema desde cero

1. Ejecutar `db/script.sql` en SQL Server (se puede correr más de una vez).
2. `cd bak` y `npm install`
3. Copiar `env.ejemplo` como `.env` y completar los datos de conexión.
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
| 50001 | 400 | Pedido sin renglones válidos |
| 50002 | 400 | Producto inexistente o inactivo |
| 50003 | 400 | Stock insuficiente |
| 50004 | 404 | Pedido no encontrado |
| 50005 | 400 | Transición de estado inválida |
| 50006 | 404 | Cliente no encontrado |

## Flujo de trabajo con Git

- `main` siempre funciona: nadie programa directo en `main`.
- Cada funcionalidad en su rama (`rama-<funcionalidad>-<nombre>`) y entra a `main` por Pull Request revisado por otro integrante.
- Commits chicos y con mensajes claros, repartidos entre todos.
