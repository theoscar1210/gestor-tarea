# Plan de instalación y puesta en marcha

Este documento define un plan paso a paso para instalar, validar y operar el proyecto en entorno local.

## 1. Objetivo

Dejar operativo el **backend Spring Boot** y el **frontend React** de forma consistente en un entorno de desarrollo.

## 2. Prerrequisitos

- Sistema operativo: Linux/macOS/Windows (WSL recomendado para Windows).
- Java 17 instalado y en PATH.
- Maven 3.9+ instalado y en PATH.
- Node.js 18+ y npm 9+ instalados.
- MySQL 8+ en ejecución.

## 3. Plan por fases

### Fase A — Preparación del entorno

1. Verificar versiones:
   - `java -version`
   - `mvn -version`
   - `node -v`
   - `npm -v`
2. Confirmar acceso a MySQL.
3. Clonar repositorio y abrir carpeta del proyecto.

**Criterio de éxito:** herramientas disponibles y versiones correctas.

---

### Fase B — Configuración del backend

1. Crear base de datos (ejemplo: `gestor_tareas`).
2. Editar `src/main/resources/application.properties` con:
   - URL JDBC
   - usuario
   - contraseña
3. Instalar dependencias y compilar:
   - `mvn clean package`
4. Levantar API:
   - `mvn spring-boot:run`

**Criterio de éxito:** API responde en `http://localhost:8080`.

---

### Fase C — Configuración del frontend

1. Ir al directorio frontend:
   - `cd gestor-tareas-front`
2. Instalar dependencias:
   - `npm install`
3. Ejecutar en desarrollo:
   - `npm start`

**Criterio de éxito:** aplicación abre en `http://localhost:3000` y consume backend.

---

### Fase D — Validación funcional mínima

1. Crear una tarea.
2. Marcar tarea como realizada.
3. Eliminar tarea.
4. Verificar notificaciones por vencimiento cercano.

**Criterio de éxito:** CRUD y notificaciones funcionando de extremo a extremo.

---

### Fase E — Build y control de calidad

1. Backend:
   - `mvn test`
2. Frontend:
   - `npm run build`

**Criterio de éxito:** pruebas y build final sin errores críticos.

## 4. Riesgos y mitigaciones

- **Error de conexión a Maven Central (403/red):** usar repositorio corporativo o cache local.
- **Credenciales MySQL inválidas:** revisar `application.properties` y permisos del usuario.
- **Conflicto de puertos (8080/3000):** reconfigurar puertos en backend o frontend.

## 5. Checklist de cierre

- [ ] Backend levantado correctamente.
- [ ] Frontend levantado correctamente.
- [ ] Flujo CRUD validado.
- [ ] Notificaciones validadas.
- [ ] Build de frontend generado.
- [ ] Pruebas backend ejecutadas (si entorno lo permite).

## 6. Recomendación de despliegue futuro

Como siguiente paso, preparar `docker-compose` con servicios:
- `app-backend`
- `app-frontend`
- `mysql`

Esto reducirá diferencias entre entornos y acelerará onboarding.
