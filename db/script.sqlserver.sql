/* ============================================================
   CelularesVR - Trabajo Final Integrador (Programación II)
   Script autosuficiente: se puede ejecutar varias veces sin romper nada.
   Crea: base, login prog2, tablas con FK, datos de ejemplo y SPs usp_.
   ============================================================ */

USE master;
GO

-- 1) Base de datos -------------------------------------------------
IF DB_ID(N'CelularesVR') IS NULL
    CREATE DATABASE CelularesVR;
GO

USE CelularesVR;
GO

-- 2) Login y usuario prog2 (ajustar la clave a la que use la cátedra) --
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'prog2')
    CREATE LOGIN prog2 WITH PASSWORD = N'Prog2.2026!', CHECK_POLICY = OFF;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'prog2')
    CREATE USER prog2 FOR LOGIN prog2;
GO

-- Permisos mínimos: solo puede ejecutar procedimientos almacenados
GRANT EXECUTE TO prog2;
GO

-- 3) Tablas -------------------------------------------------------
IF OBJECT_ID(N'dbo.Categorias', N'U') IS NULL
CREATE TABLE dbo.Categorias (
    CategoriaId INT IDENTITY(1,1) CONSTRAINT PK_Categorias PRIMARY KEY,
    Nombre      NVARCHAR(50) NOT NULL CONSTRAINT UQ_Categorias_Nombre UNIQUE
);
GO

IF OBJECT_ID(N'dbo.Productos', N'U') IS NULL
CREATE TABLE dbo.Productos (
    ProductoId  INT IDENTITY(1,1) CONSTRAINT PK_Productos PRIMARY KEY,
    CategoriaId INT NOT NULL
        CONSTRAINT FK_Productos_Categorias REFERENCES dbo.Categorias(CategoriaId),
    Nombre      NVARCHAR(100) NOT NULL,
    Marca       NVARCHAR(50)  NOT NULL,
    Precio      DECIMAL(12,2) NOT NULL CONSTRAINT CK_Productos_Precio CHECK (Precio > 0),
    Stock       INT NOT NULL CONSTRAINT CK_Productos_Stock CHECK (Stock >= 0),
    Activo      BIT NOT NULL CONSTRAINT DF_Productos_Activo DEFAULT 1
);
GO

IF OBJECT_ID(N'dbo.Clientes', N'U') IS NULL
CREATE TABLE dbo.Clientes (
    ClienteId INT IDENTITY(1,1) CONSTRAINT PK_Clientes PRIMARY KEY,
    Nombre    NVARCHAR(100) NOT NULL,
    Telefono  NVARCHAR(30)  NULL,
    Email     NVARCHAR(100) NULL
);
GO

IF OBJECT_ID(N'dbo.Pedidos', N'U') IS NULL
CREATE TABLE dbo.Pedidos (
    PedidoId  INT IDENTITY(1,1) CONSTRAINT PK_Pedidos PRIMARY KEY,
    ClienteId INT NOT NULL
        CONSTRAINT FK_Pedidos_Clientes REFERENCES dbo.Clientes(ClienteId),
    Fecha     DATETIME2(0) NOT NULL CONSTRAINT DF_Pedidos_Fecha DEFAULT SYSDATETIME(),
    Estado    NVARCHAR(20) NOT NULL CONSTRAINT DF_Pedidos_Estado DEFAULT N'Pendiente'
        CONSTRAINT CK_Pedidos_Estado CHECK (Estado IN (N'Pendiente', N'Listo', N'Entregado')),
    Total     DECIMAL(14,2) NOT NULL CONSTRAINT DF_Pedidos_Total DEFAULT 0
);
GO

IF OBJECT_ID(N'dbo.PedidoDetalle', N'U') IS NULL
CREATE TABLE dbo.PedidoDetalle (
    DetalleId      INT IDENTITY(1,1) CONSTRAINT PK_PedidoDetalle PRIMARY KEY,
    PedidoId       INT NOT NULL
        CONSTRAINT FK_Detalle_Pedidos REFERENCES dbo.Pedidos(PedidoId),
    ProductoId     INT NOT NULL
        CONSTRAINT FK_Detalle_Productos REFERENCES dbo.Productos(ProductoId),
    Cantidad       INT NOT NULL CONSTRAINT CK_Detalle_Cantidad CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(12,2) NOT NULL,   -- precio al momento de la compra
    Subtotal AS (Cantidad * PrecioUnitario) PERSISTED  -- lo calcula la base
);
GO

-- 4) Datos de ejemplo (solo si las tablas están vacías) ------------
IF NOT EXISTS (SELECT 1 FROM dbo.Categorias)
BEGIN
    INSERT INTO dbo.Categorias (Nombre) VALUES
        (N'Celulares'), (N'Fundas'), (N'Cargadores y cables'),
        (N'Auriculares'), (N'Protectores de pantalla');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Productos)
BEGIN
    INSERT INTO dbo.Productos (CategoriaId, Nombre, Marca, Precio, Stock)
    SELECT c.CategoriaId, v.Nombre, v.Marca, v.Precio, v.Stock
    FROM (VALUES
        (N'Celulares', N'Samsung Galaxy A15 128GB',    N'Samsung', 289999.00, 15),
        (N'Celulares', N'Motorola Moto G54 256GB',     N'Motorola', 329999.00, 10),
        (N'Celulares', N'Xiaomi Redmi Note 13 256GB',  N'Xiaomi',  399999.00, 12),
        (N'Celulares', N'iPhone 13 128GB',             N'Apple',   899999.00, 5),
        (N'Celulares', N'Samsung Galaxy S24 256GB',    N'Samsung', 1299999.00, 4),
        (N'Fundas', N'Funda de silicona universal',    N'Genérica', 12500.00, 40),
        (N'Fundas', N'Funda antigolpe reforzada',      N'Spigen',   18900.00, 25),
        (N'Cargadores y cables', N'Cargador rápido 25W USB-C', N'Samsung', 24900.00, 30),
        (N'Cargadores y cables', N'Cable USB-C a USB-C 1m',    N'Anker',    8500.00, 50),
        (N'Auriculares', N'Auriculares Bluetooth TWS',  N'JBL',   34900.00, 20),
        (N'Protectores de pantalla', N'Vidrio templado 9H', N'Genérica', 6900.00, 60),
        (N'Cargadores y cables', N'Power bank 10000 mAh',   N'Xiaomi', 29900.00, 18)
    ) AS v(Categoria, Nombre, Marca, Precio, Stock)
    JOIN dbo.Categorias c ON c.Nombre = v.Categoria;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Clientes)
BEGIN
    INSERT INTO dbo.Clientes (Nombre, Telefono, Email) VALUES
        (N'Ana Pereyra',   N'3525-401122', N'ana.pereyra@mail.com'),
        (N'Luis Gómez',    N'3525-402233', N'luis.gomez@mail.com'),
        (N'Marta Ferreyra',N'3525-403344', N'marta.ferreyra@mail.com'),
        (N'Diego Rivarola',N'3525-404455', N'diego.rivarola@mail.com'),
        (N'Sofía Luna',    N'3525-405566', N'sofia.luna@mail.com');
END
GO

-- Pedidos de ejemplo con sus renglones (para que las estadísticas tengan datos)
IF NOT EXISTS (SELECT 1 FROM dbo.Pedidos)
BEGIN
    DECLARE @p INT;

    -- Pedido 1: Ana, Entregado
    INSERT INTO dbo.Pedidos (ClienteId, Fecha, Estado)
    SELECT ClienteId, '2026-10-19 10:15', N'Entregado' FROM dbo.Clientes WHERE Email = N'ana.pereyra@mail.com';
    SET @p = SCOPE_IDENTITY();
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Samsung Galaxy A15 128GB';
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Funda de silicona universal';

    -- Pedido 2: Luis, Listo
    INSERT INTO dbo.Pedidos (ClienteId, Fecha, Estado)
    SELECT ClienteId, '2026-10-22 16:40', N'Listo' FROM dbo.Clientes WHERE Email = N'luis.gomez@mail.com';
    SET @p = SCOPE_IDENTITY();
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Motorola Moto G54 256GB';
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 2, Precio FROM dbo.Productos WHERE Nombre = N'Vidrio templado 9H';

    -- Pedido 3: Marta, Pendiente
    INSERT INTO dbo.Pedidos (ClienteId, Fecha, Estado)
    SELECT ClienteId, '2026-10-24 11:05', N'Pendiente' FROM dbo.Clientes WHERE Email = N'marta.ferreyra@mail.com';
    SET @p = SCOPE_IDENTITY();
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Auriculares Bluetooth TWS';
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Cargador rápido 25W USB-C';

    -- Pedido 4: Diego, Pendiente
    INSERT INTO dbo.Pedidos (ClienteId, Fecha, Estado)
    SELECT ClienteId, '2026-10-25 09:30', N'Pendiente' FROM dbo.Clientes WHERE Email = N'diego.rivarola@mail.com';
    SET @p = SCOPE_IDENTITY();
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'iPhone 13 128GB';
    INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
    SELECT @p, ProductoId, 1, Precio FROM dbo.Productos WHERE Nombre = N'Funda antigolpe reforzada';

    -- Totales calculados por la base a partir del detalle
    UPDATE ped
    SET Total = (SELECT SUM(d.Subtotal) FROM dbo.PedidoDetalle d WHERE d.PedidoId = ped.PedidoId)
    FROM dbo.Pedidos ped;
END
GO

/* ============================================================
   5) Procedimientos almacenados (prefijo usp_)
   Códigos de error propios:
     50001 pedido sin renglones válidos      -> HTTP 400
     50002 producto inexistente o inactivo   -> HTTP 400
     50003 stock insuficiente                -> HTTP 400
     50004 pedido no encontrado              -> HTTP 404
     50005 transición de estado inválida     -> HTTP 400
     50006 cliente no encontrado             -> HTTP 404
   ============================================================ */

-- Catálogos ------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.usp_Categorias_Listar
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CategoriaId, Nombre FROM dbo.Categorias ORDER BY Nombre;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Productos_Listar
    @CategoriaId INT = NULL      -- opcional: filtra por categoría
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.ProductoId, p.Nombre, p.Marca, p.Precio, p.Stock,
           c.CategoriaId, c.Nombre AS Categoria
    FROM dbo.Productos p
    JOIN dbo.Categorias c ON c.CategoriaId = p.CategoriaId
    WHERE p.Activo = 1
      AND (@CategoriaId IS NULL OR p.CategoriaId = @CategoriaId)
    ORDER BY c.Nombre, p.Nombre;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Clientes_Listar
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ClienteId, Nombre, Telefono, Email FROM dbo.Clientes ORDER BY Nombre;
END
GO

-- Consulta 1: LISTADO RELACIONADO (une 4 tablas con JOIN) ----------
CREATE OR ALTER PROCEDURE dbo.usp_Pedidos_Listar
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ped.PedidoId, ped.Fecha, ped.Estado, ped.Total,
           cli.Nombre AS Cliente,
           STRING_AGG(CONCAT(pro.Nombre, N' x', det.Cantidad), N', ') AS Productos
    FROM dbo.Pedidos ped
    JOIN dbo.Clientes cli      ON cli.ClienteId  = ped.ClienteId
    JOIN dbo.PedidoDetalle det ON det.PedidoId   = ped.PedidoId
    JOIN dbo.Productos pro     ON pro.ProductoId = det.ProductoId
    GROUP BY ped.PedidoId, ped.Fecha, ped.Estado, ped.Total, cli.Nombre
    ORDER BY ped.Fecha DESC;
END
GO

-- Consulta 2: BÚSQUEDA CON FILTROS OPCIONALES ----------------------
CREATE OR ALTER PROCEDURE dbo.usp_Pedidos_Buscar
    @Texto  NVARCHAR(100) = NULL,   -- nombre de cliente o de producto
    @Estado NVARCHAR(20)  = NULL,
    @Desde  DATE          = NULL,
    @Hasta  DATE          = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ped.PedidoId, ped.Fecha, ped.Estado, ped.Total,
           cli.Nombre AS Cliente,
           STRING_AGG(CONCAT(pro.Nombre, N' x', det.Cantidad), N', ') AS Productos
    FROM dbo.Pedidos ped
    JOIN dbo.Clientes cli      ON cli.ClienteId  = ped.ClienteId
    JOIN dbo.PedidoDetalle det ON det.PedidoId   = ped.PedidoId
    JOIN dbo.Productos pro     ON pro.ProductoId = det.ProductoId
    WHERE (@Estado IS NULL OR ped.Estado = @Estado)
      AND (@Desde  IS NULL OR ped.Fecha >= @Desde)
      AND (@Hasta  IS NULL OR ped.Fecha <  DATEADD(DAY, 1, @Hasta))
      AND (@Texto  IS NULL
           OR cli.Nombre LIKE N'%' + @Texto + N'%'
           OR EXISTS (SELECT 1
                      FROM dbo.PedidoDetalle d2
                      JOIN dbo.Productos p2 ON p2.ProductoId = d2.ProductoId
                      WHERE d2.PedidoId = ped.PedidoId
                        AND p2.Nombre LIKE N'%' + @Texto + N'%'))
    GROUP BY ped.PedidoId, ped.Fecha, ped.Estado, ped.Total, cli.Nombre
    ORDER BY ped.Fecha DESC;
END
GO

-- Consulta 3: AGREGADA (GROUP BY + COUNT/SUM + STRING_AGG) ---------
CREATE OR ALTER PROCEDURE dbo.usp_Estadisticas_VentasPorCategoria
AS
BEGIN
    SET NOCOUNT ON;
    SELECT c.CategoriaId,
           c.Nombre                      AS Categoria,
           COUNT(DISTINCT det.PedidoId)  AS CantPedidos,
           SUM(det.Cantidad)             AS Unidades,
           SUM(det.Subtotal)             AS TotalVendido,
           (SELECT STRING_AGG(x.Nombre, N', ')
            FROM (SELECT DISTINCT p2.Nombre
                  FROM dbo.PedidoDetalle d2
                  JOIN dbo.Productos p2 ON p2.ProductoId = d2.ProductoId
                  WHERE p2.CategoriaId = c.CategoriaId) AS x) AS Productos
    FROM dbo.Categorias c
    JOIN dbo.Productos p       ON p.CategoriaId = c.CategoriaId
    JOIN dbo.PedidoDetalle det ON det.ProductoId = p.ProductoId
    GROUP BY c.CategoriaId, c.Nombre
    ORDER BY TotalVendido DESC;
END
GO

-- Detalle de un pedido (sirve para probar el 404) ------------------
CREATE OR ALTER PROCEDURE dbo.usp_Pedidos_Obtener
    @PedidoId INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.Pedidos WHERE PedidoId = @PedidoId)
        THROW 50004, N'El pedido indicado no existe.', 1;

    SELECT ped.PedidoId, ped.Fecha, ped.Estado, ped.Total, cli.Nombre AS Cliente
    FROM dbo.Pedidos ped
    JOIN dbo.Clientes cli ON cli.ClienteId = ped.ClienteId
    WHERE ped.PedidoId = @PedidoId;

    SELECT det.DetalleId, pro.ProductoId, pro.Nombre AS Producto,
           det.Cantidad, det.PrecioUnitario, det.Subtotal
    FROM dbo.PedidoDetalle det
    JOIN dbo.Productos pro ON pro.ProductoId = det.ProductoId
    WHERE det.PedidoId = @PedidoId;
END
GO

-- Consulta 4: OPERACIÓN DE NEGOCIO CON REGLAS ----------------------
-- @DetalleJson ejemplo: [{"productoId":1,"cantidad":2},{"productoId":6,"cantidad":1}]
CREATE OR ALTER PROCEDURE dbo.usp_Pedidos_Crear
    @ClienteId   INT,
    @DetalleJson NVARCHAR(MAX),
    @PedidoId    INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validación: el cliente debe existir
        IF NOT EXISTS (SELECT 1 FROM dbo.Clientes WHERE ClienteId = @ClienteId)
            THROW 50006, N'El cliente indicado no existe.', 1;

        -- Validación: el JSON debe ser válido
        IF @DetalleJson IS NULL OR ISJSON(@DetalleJson) = 0
            THROW 50001, N'El detalle del pedido es inválido o está vacío.', 1;

        -- Se abre el JSON con OPENJSON; se agrupa por producto por si viene repetido
        DECLARE @Items TABLE (ProductoId INT PRIMARY KEY, Cantidad INT NOT NULL);

        INSERT INTO @Items (ProductoId, Cantidad)
        SELECT productoId, SUM(cantidad)
        FROM OPENJSON(@DetalleJson)
             WITH (productoId INT '$.productoId', cantidad INT '$.cantidad')
        WHERE productoId IS NOT NULL
        GROUP BY productoId;

        IF NOT EXISTS (SELECT 1 FROM @Items) OR EXISTS (SELECT 1 FROM @Items WHERE Cantidad IS NULL OR Cantidad <= 0)
            THROW 50001, N'El pedido debe tener al menos un renglón con cantidad mayor a cero.', 1;

        -- Validación: todos los productos deben existir y estar activos
        IF EXISTS (SELECT 1
                   FROM @Items i
                   LEFT JOIN dbo.Productos p ON p.ProductoId = i.ProductoId AND p.Activo = 1
                   WHERE p.ProductoId IS NULL)
            THROW 50002, N'Alguno de los productos no existe o no está disponible.', 1;

        -- Validación: stock suficiente (se bloquean las filas para evitar ventas simultáneas)
        IF EXISTS (SELECT 1
                   FROM @Items i
                   JOIN dbo.Productos p WITH (UPDLOCK, HOLDLOCK) ON p.ProductoId = i.ProductoId
                   WHERE p.Stock < i.Cantidad)
            THROW 50003, N'Stock insuficiente para uno o más productos.', 1;

        -- Alta del pedido
        INSERT INTO dbo.Pedidos (ClienteId) VALUES (@ClienteId);
        SET @PedidoId = SCOPE_IDENTITY();

        -- Renglones: el precio lo toma la base, nunca el front
        INSERT INTO dbo.PedidoDetalle (PedidoId, ProductoId, Cantidad, PrecioUnitario)
        SELECT @PedidoId, i.ProductoId, i.Cantidad, p.Precio
        FROM @Items i
        JOIN dbo.Productos p ON p.ProductoId = i.ProductoId;

        -- Descuento de stock
        UPDATE p
        SET p.Stock = p.Stock - i.Cantidad
        FROM dbo.Productos p
        JOIN @Items i ON i.ProductoId = p.ProductoId;

        -- Total calculado por la base
        UPDATE dbo.Pedidos
        SET Total = (SELECT SUM(Subtotal) FROM dbo.PedidoDetalle WHERE PedidoId = @PedidoId)
        WHERE PedidoId = @PedidoId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;   -- se relanza el error original para que lo traduzca el middleware
    END CATCH
END
GO

-- Cambio de estado: Pendiente -> Listo -> Entregado ----------------
CREATE OR ALTER PROCEDURE dbo.usp_Pedidos_CambiarEstado
    @PedidoId    INT,
    @NuevoEstado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @EstadoActual NVARCHAR(20);

        SELECT @EstadoActual = Estado
        FROM dbo.Pedidos WITH (UPDLOCK)
        WHERE PedidoId = @PedidoId;

        IF @EstadoActual IS NULL
            THROW 50004, N'El pedido indicado no existe.', 1;

        -- Solo se permite avanzar un paso: no se retrocede ni se saltea
        IF NOT ( (@EstadoActual = N'Pendiente' AND @NuevoEstado = N'Listo')
              OR (@EstadoActual = N'Listo'     AND @NuevoEstado = N'Entregado') )
            THROW 50005, N'Transición de estado inválida: no se puede retroceder ni saltear estados.', 1;

        UPDATE dbo.Pedidos SET Estado = @NuevoEstado WHERE PedidoId = @PedidoId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

/* ============================================================
   6) Pruebas rápidas (descomentar para probar en SSMS)
   ============================================================
-- DECLARE @id INT;
-- EXEC dbo.usp_Pedidos_Crear @ClienteId = 1,
--      @DetalleJson = N'[{"productoId":1,"cantidad":1},{"productoId":6,"cantidad":2}]',
--      @PedidoId = @id OUTPUT;
-- SELECT @id AS PedidoCreado;
-- EXEC dbo.usp_Pedidos_Listar;
-- EXEC dbo.usp_Pedidos_Buscar @Estado = N'Pendiente';
-- EXEC dbo.usp_Estadisticas_VentasPorCategoria;
-- EXEC dbo.usp_Pedidos_CambiarEstado @PedidoId = 3, @NuevoEstado = N'Listo';
-- EXEC dbo.usp_Pedidos_CambiarEstado @PedidoId = 3, @NuevoEstado = N'Pendiente'; -- error 50005
*/
