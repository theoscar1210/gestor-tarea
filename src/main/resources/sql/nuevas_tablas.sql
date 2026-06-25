-- ============================================================
-- NUEVAS TABLAS — Gestor de Tareas Sprint
-- Ejecutar manualmente en la base de datos tareas_bd
-- ============================================================

-- Módulo 1: Lista de Mercado
CREATE TABLE lista_mercado (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  cantidad        INT DEFAULT 1,
  unidad          VARCHAR(20) DEFAULT 'unidad',
  comprado        BOOLEAN DEFAULT FALSE,
  fecha_agregado  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Módulo 2: Obligaciones y Pagos
CREATE TABLE obligaciones (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  tipo             ENUM('servicio_publico','tarjeta_credito','arriendo','suscripcion','otro') NOT NULL,
  monto            DECIMAL(12,2),
  dia_vencimiento  INT NOT NULL,
  activo           BOOLEAN DEFAULT TRUE,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_pagos (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  obligacion_id  BIGINT NOT NULL,
  fecha_pago     DATE,
  monto_pagado   DECIMAL(12,2),
  pagado         BOOLEAN DEFAULT FALSE,
  mes_ano        VARCHAR(7),
  FOREIGN KEY (obligacion_id) REFERENCES obligaciones(id)
);

-- Módulo 3: Presupuesto
CREATE TABLE presupuesto_mensual (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  mes_ano        VARCHAR(7) NOT NULL,
  salario_total  DECIMAL(12,2) NOT NULL,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categoria_gasto (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  tipo                ENUM('fijo','variable','ahorro','inversion') NOT NULL,
  porcentaje_sugerido DECIMAL(5,2),
  color               VARCHAR(7)
);

CREATE TABLE gasto (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  presupuesto_id  BIGINT NOT NULL,
  categoria_id    BIGINT NOT NULL,
  descripcion     VARCHAR(200),
  monto           DECIMAL(12,2) NOT NULL,
  fecha           DATE NOT NULL,
  FOREIGN KEY (presupuesto_id) REFERENCES presupuesto_mensual(id),
  FOREIGN KEY (categoria_id)   REFERENCES categoria_gasto(id)
);

-- Seed: Categorías método 50/30/20
INSERT INTO categoria_gasto (nombre, tipo, porcentaje_sugerido, color) VALUES
  ('Vivienda / Arriendo',    'fijo',     30.00, '#4f46e5'),
  ('Servicios Públicos',     'fijo',     10.00, '#7c3aed'),
  ('Alimentación',           'fijo',      8.00, '#059669'),
  ('Transporte',             'fijo',      7.00, '#0891b2'),
  ('Salud',                  'fijo',      5.00, '#dc2626'),
  ('Entretenimiento',        'variable', 10.00, '#f59e0b'),
  ('Restaurantes / Salidas', 'variable',  8.00, '#d97706'),
  ('Ropa / Calzado',         'variable',  6.00, '#7c3aed'),
  ('Hobbies / Suscripciones','variable',  6.00, '#6366f1'),
  ('Fondo de Emergencia',    'ahorro',   10.00, '#10b981'),
  ('Ahorro Metas',           'ahorro',    5.00, '#34d399'),
  ('Inversión',              'inversion',  5.00, '#06b6d4');
