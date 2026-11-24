# Sistema de Gestión Académica (SGA)

Proyecto desarrollado durante la materia Programación IV.

## Tecnologías

- Frontend React: React, Vite, React Router y Material UI.
- Frontend original: HTML, CSS y JavaScript.
- Backend: Node.js, Express y Mongoose.
- Base de datos: MongoDB.
- Autenticación: bcrypt y JSON Web Tokens (JWT).

## Funcionalidades

- Gestión de alumnos, docentes y materias.
- API REST conectada a MongoDB.
- Inicio de sesión con email y contraseña.
- Protección de rutas y operaciones de alumnos y docentes mediante JWT.
- Cierre de sesión desde la interfaz React.

## Autenticación

El inicio de sesión se realiza mediante `POST /auth/login`. El backend devuelve un
token JWT que el frontend utiliza como `Authorization: Bearer <token>` al acceder
a las rutas protegidas. La sesión se puede cerrar desde la navegación principal.

Configurar `PORT`, `MONGO_URI` y `JWT_SECRET` en `backend/.env`. La duración del
token puede configurarse opcionalmente con `JWT_EXPIRES_IN`. No subir al
repositorio archivos `.env` ni tokens reales.

## Autoría

Proyecto de la materia Programación IV, basado en el repositorio de la cátedra.
