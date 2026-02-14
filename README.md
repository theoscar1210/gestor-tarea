# Gestor de Tareas

Aplicación full-stack para gestionar tareas con prioridad, categoría, estado y notificaciones de vencimiento.

## Stack actual

- **Backend:** Java 17 + Spring Boot 3 + Spring Data JPA + MySQL.
- **Frontend:** React 19 + Create React App + Bootstrap 5 + SweetAlert2.

## Estructura del repositorio

```text
.
├── src/                              # Backend Spring Boot
│   ├── main/java/com/gestortareas/
│   │   ├── GestorTareasSprint/
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── config/
│   └── main/resources/application.properties
├── gestor-tareas-front/              # Frontend React
│   └── src/
│       ├── app/
│       ├── features/
│       │   ├── tasks/
│       │   └── notifications/
│       ├── pages/
│       └── shared/
└── pom.xml
```

## Arquitectura frontend (resumen)

Se reorganizó el frontend por dominios para mejorar mantenibilidad y escalabilidad:

- `features/tasks`: API, lógica (`useTasks`) y UI de tareas.
- `features/notifications`: cálculo y UI de notificaciones.
- `pages/TareasPage.jsx`: orquestador de la pantalla principal.
- `shared/lib`: utilidades reutilizables de estilos/comportamiento.

## Requisitos

- Java 17
- Maven 3.9+
- Node.js 18+
- npm 9+
- MySQL 8+

## Configuración rápida

### 1) Backend

1. Crear base de datos en MySQL.
2. Configurar credenciales en `src/main/resources/application.properties`.
3. Ejecutar:

```bash
mvn spring-boot:run
```

Backend disponible en `http://localhost:8080`.

### 2) Frontend

```bash
cd gestor-tareas-front
npm install
npm start
```

Frontend disponible en `http://localhost:3000`.

## Scripts útiles

### Backend

- `mvn test` → corre pruebas de backend.
- `mvn spring-boot:run` → levanta API local.

### Frontend

- `npm start` → entorno de desarrollo.
- `npm run build` → build de producción.
- `npm test` → pruebas de frontend.

## Próximos pasos recomendados

- Agregar validaciones de DTO en backend.
- Incorporar manejo de errores tipado en frontend.
- Añadir tests unitarios para hooks (`useTasks`) y componentes críticos.
- Preparar dockerización para despliegue reproducible.

---

Consulta también el plan detallado de instalación en [`INSTALLATION_PLAN.md`](./INSTALLATION_PLAN.md).
