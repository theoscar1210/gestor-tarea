-- ============================================================
-- MIGRACIÓN: Soporte multi-usuario
-- Ejecutar UNA VEZ antes de desplegar el nuevo backend
-- MySQL no soporta ADD COLUMN IF NOT EXISTS → ejecutar línea
-- a línea e ignorar errores "Duplicate column name"
-- ============================================================

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  email      VARCHAR(150),
  activo     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agregar usuario_id a todas las tablas de datos
--    Ejecutar cada línea por separado; ignorar error si columna ya existe

ALTER TABLE tarea              ADD COLUMN usuario_id BIGINT;
ALTER TABLE obligaciones       ADD COLUMN usuario_id BIGINT;
ALTER TABLE presupuesto_mensual ADD COLUMN usuario_id BIGINT;
ALTER TABLE lista_mercado      ADD COLUMN usuario_id BIGINT;
ALTER TABLE ingreso            ADD COLUMN usuario_id BIGINT;
ALTER TABLE movimiento_fondo   ADD COLUMN usuario_id BIGINT;

-- ============================================================
-- DESPUÉS de desplegar el nuevo backend y que arranque:
--   • Se creará automáticamente el usuario admin/gestor2026
--   • Todos los datos existentes (usuario_id NULL) se asignan
--     al usuario admin vía InicializacionService @PostConstruct
-- ============================================================
