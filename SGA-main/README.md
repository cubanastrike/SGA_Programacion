# Sistema de Gestión Académica (SGA)

Proyecto desarrollado durante la materia Programación IV.

## Tecnologías

- Frontend React: React, Vite, React Router y Material UI.
- Backend: Node.js, Express y Mongoose.
- Base de datos: MongoDB.
- Autenticación: bcrypt y JSON Web Tokens (JWT).

## Funcionalidades

- Gestión de alumnos, docentes y materias.
- API REST conectada a MongoDB.
- Inicio de sesión con email y contraseña.
- Protección de rutas mediante JWT.
- Permisos por rol en alumnos: los administradores pueden modificar; los usuarios pueden consultar.
- Cierre de sesión desde la interfaz React.

## Autenticación

El inicio de sesión se realiza mediante `POST /auth/login`. El backend devuelve un
token JWT que el frontend utiliza como `Authorization: Bearer <token>` al acceder
a las rutas protegidas. La sesión se puede cerrar desde la navegación principal.

Configurar `PORT`, `MONGO_URI` y `JWT_SECRET` en `backend/.env`. La duración del
token puede configurarse opcionalmente con `JWT_EXPIRES_IN`. No subir al
repositorio archivos `.env` ni tokens reales.

La URL del backend para React se configura opcionalmente con `VITE_API_URL` en
`frontend-react/.env.local`. Si no se define, se usa `http://localhost:3000`.

Desde `backend`, ejecutar `node crearUsuario.js` para crear el administrador de
prueba o `node nuevoUsuario.js` para crear un usuario de consulta. Los comandos
equivalentes de npm son `npm run crear-usuario` y
`npm run crear-usuario-consulta`.

## Autoría

Proyecto de la materia Programación IV, basado en el repositorio de la cátedra.
