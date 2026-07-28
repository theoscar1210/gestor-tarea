-- ============================================================
-- MIGRACIÓN v2 — Módulo Tareas extendido
-- Ejecutar en Railway Query panel UNA sentencia a la vez
-- Si dice "Duplicate column name": la columna ya existe, omitir.
-- ============================================================

-- 1. Extensiones a tabla tarea
ALTER TABLE tarea ADD COLUMN tipo VARCHAR(10) DEFAULT 'TAREA';
ALTER TABLE tarea ADD COLUMN hora_inicio VARCHAR(5);
ALTER TABLE tarea ADD COLUMN hora_fin VARCHAR(5);
ALTER TABLE tarea ADD COLUMN etiqueta VARCHAR(20);
ALTER TABLE tarea ADD COLUMN recurrencia VARCHAR(20) DEFAULT 'NINGUNA';
ALTER TABLE tarea ADD COLUMN intervalo_recurrencia INT;
ALTER TABLE tarea ADD COLUMN texto_natural TEXT;
ALTER TABLE tarea ADD COLUMN contacto_id BIGINT;
ALTER TABLE tarea ADD COLUMN snoozed_until DATETIME;

-- 2. Tabla subtareas (checklist dentro de un evento/tarea)
CREATE TABLE IF NOT EXISTS subtarea (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tarea_id    BIGINT NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  completada  BOOLEAN NOT NULL DEFAULT FALSE,
  orden       INT DEFAULT 0,
  usuario_id  BIGINT NOT NULL,
  FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON DELETE CASCADE
);

-- 3. Tabla contactos (vinculados a eventos)
CREATE TABLE IF NOT EXISTS contacto (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  telefono   VARCHAR(30),
  email      VARCHAR(150),
  usuario_id BIGINT NOT NULL
);

-- 4. Tabla plantillas de rutina
CREATE TABLE IF NOT EXISTS plantilla_rutina (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  tareas_json TEXT NOT NULL,
  usuario_id  BIGINT NOT NULL
);

-- 5. Tabla ubicaciones para recordatorios por geolocalización
CREATE TABLE IF NOT EXISTS ubicacion_recordatorio (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL,
  latitud      DOUBLE NOT NULL,
  longitud     DOUBLE NOT NULL,
  radio_metros INT DEFAULT 200,
  tarea_titulo VARCHAR(200) NOT NULL,
  activa       BOOLEAN DEFAULT TRUE,
  usuario_id   BIGINT NOT NULL
);
