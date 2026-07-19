-- ============================================================
-- SCHEMA COMPLETO — FIN TASK / Gestor de Tareas
-- Idempotente: seguro ejecutar en BD vacía O existente
-- Railway MySQL 8.x
-- ============================================================

-- Procedimiento auxiliar: agrega columna solo si no existe
DROP PROCEDURE IF EXISTS add_col;
DELIMITER $$
CREATE PROCEDURE add_col(IN tbl VARCHAR(100), IN col VARCHAR(100), IN def TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = tbl AND COLUMN_NAME = col
  ) THEN
    SET @s = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN `', col, '` ', def);
    PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;
  END IF;
END$$
DELIMITER ;

-- ── 1. Usuarios ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuario (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  email      VARCHAR(150),
  activo     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── 2. Tareas ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tarea (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  descripcion VARCHAR(1000),
  vencimiento DATETIME,
  categoria   VARCHAR(100),
  prioridad   VARCHAR(10),
  realizado   BOOLEAN DEFAULT FALSE,
  usuario_id  BIGINT
);

-- ── 3. Lista de Mercado ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS lista_mercado (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  cantidad       INT DEFAULT 1,
  unidad         VARCHAR(20) DEFAULT 'unidad',
  comprado       BOOLEAN DEFAULT FALSE,
  fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id     BIGINT
);

-- ── 4. Obligaciones / Pagos ──────────────────────────────────
CREATE TABLE IF NOT EXISTS obligaciones (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  tipo            ENUM('servicio_publico','tarjeta_credito','arriendo','suscripcion','otro') NOT NULL,
  monto           DECIMAL(12,2),
  dia_vencimiento INT NOT NULL,
  activo          BOOLEAN DEFAULT TRUE,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id      BIGINT
);

CREATE TABLE IF NOT EXISTS historial_pagos (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  obligacion_id BIGINT NOT NULL,
  fecha_pago    DATE,
  monto_pagado  DECIMAL(12,2),
  pagado        BOOLEAN DEFAULT FALSE,
  mes_ano       VARCHAR(7),
  FOREIGN KEY (obligacion_id) REFERENCES obligaciones(id)
);

-- ── 5. Presupuesto ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS presupuesto_mensual (
  id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
  mes_ano                     VARCHAR(7) NOT NULL,
  salario_total               DECIMAL(12,2) NOT NULL,
  created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
  porcentaje_ahorro           DECIMAL(5,2) DEFAULT 10.00,
  porcentaje_fondo_emergencia DECIMAL(5,2) DEFAULT 5.00,
  usuario_id                  BIGINT
);

CREATE TABLE IF NOT EXISTS categoria_gasto (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  tipo                ENUM('fijo','variable','ahorro','inversion') NOT NULL,
  porcentaje_sugerido DECIMAL(5,2),
  color               VARCHAR(7)
);

CREATE TABLE IF NOT EXISTS gasto (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  presupuesto_id BIGINT NOT NULL,
  categoria_id   BIGINT NOT NULL,
  descripcion    VARCHAR(200),
  monto          DECIMAL(12,2) NOT NULL,
  fecha          DATE NOT NULL,
  FOREIGN KEY (presupuesto_id) REFERENCES presupuesto_mensual(id),
  FOREIGN KEY (categoria_id)   REFERENCES categoria_gasto(id)
);

-- ── 6. Ingresos ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingreso (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(200) NOT NULL,
  monto       DECIMAL(12,2) NOT NULL,
  fecha       DATE NOT NULL,
  tipo        ENUM('salario','freelance','arriendo','dividendo','bono','otro') NOT NULL,
  mes_ano     VARCHAR(7) NOT NULL,
  usuario_id  BIGINT
);

-- ── 7. Movimientos de Fondo ──────────────────────────────────
CREATE TABLE IF NOT EXISTS movimiento_fondo (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tipo        VARCHAR(30) NOT NULL,
  monto       DECIMAL(12,2) NOT NULL,
  descripcion VARCHAR(200),
  fecha       DATE NOT NULL,
  mes_ano     VARCHAR(7) NOT NULL,
  usuario_id  BIGINT
);

-- ── 8. Push Subscriptions ────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscription (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  endpoint   VARCHAR(500) NOT NULL UNIQUE,
  p256dh     VARCHAR(300) NOT NULL,
  auth       VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Migraciones de columnas (idempotente) ────────────────────
CALL add_col('tarea',               'usuario_id',                   'BIGINT');
CALL add_col('lista_mercado',       'usuario_id',                   'BIGINT');
CALL add_col('obligaciones',        'usuario_id',                   'BIGINT');
CALL add_col('presupuesto_mensual', 'usuario_id',                   'BIGINT');
CALL add_col('presupuesto_mensual', 'porcentaje_ahorro',            'DECIMAL(5,2) DEFAULT 10.00');
CALL add_col('presupuesto_mensual', 'porcentaje_fondo_emergencia',  'DECIMAL(5,2) DEFAULT 5.00');
CALL add_col('ingreso',             'usuario_id',                   'BIGINT');
CALL add_col('movimiento_fondo',    'usuario_id',                   'BIGINT');

DROP PROCEDURE IF EXISTS add_col;

-- Nota: las categorías las seed Spring Boot en el primer arranque
-- (PresupuestoService @PostConstruct) solo si categoria_gasto está vacía.
