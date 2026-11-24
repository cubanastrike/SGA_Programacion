// Routes maneja las rutas de la API, es decir, los endpoints que se pueden acceder desde el frontend para realizar operaciones sobre los alumnos
const {verifyToken} = require("../middlewares/authMiddleware") // Importamos el middleware de autenticación para poder proteger las rutas de la API
const express = require("express") // Importamos express para poder crear las rutas de la API
// const alumnosController = require("../controllers/alumnos.controller")
const { // Importamos las funciones del controlador de alumnos para poder usarlas en las rutas
    obtenerAlumnos, 
    obtenerAlumno, 
    crearAlumno, 
    actualizarAlumno, 
    eliminarAlumno } = require("../controllers/alumnos.controller")// extraemos las funciones del controlador de alumnos para poder usarlas en las rutas
const router = express.Router() // Creamos un router de express para poder definir las rutas de la API

router.get("/", verifyToken, obtenerAlumnos) // Ruta para obtener todos los alumnos

router.get("/:id", verifyToken, obtenerAlumno) // Ruta para obtener un alumno por su id

router.post("/", verifyToken, crearAlumno) // Ruta para crear un nuevo alumno

router.put("/:id", verifyToken, actualizarAlumno) // Ruta para actualizar un alumno por su id

router.delete("/:id", verifyToken, eliminarAlumno) // Ruta para eliminar un alumno por su id

module.exports = router // Exportamos el router para poder usarlo en el archivo principal de la aplicación