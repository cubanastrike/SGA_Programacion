// Routes maneja las rutas de la API, es decir, los endpoints que se pueden acceder desde el frontend para realizar operaciones sobre los Docentes

const express = require("express") // Importamos express para poder crear las rutas de la API
// const DocentesController = require("../controllers/Docentes.controller")
const { // Importamos las funciones del controlador de Docentes para poder usarlas en las rutas
    obtenerDocentes, 
    obtenerDocente, 
    crearDocente, 
    actualizarDocente, 
    eliminarDocente } = require("../controllers/docentes.controller")// extraemos las funciones del controlador de Docentes para poder usarlas en las rutas
const router = express.Router() // Creamos un router de express para poder definir las rutas de la API

router.get("/", obtenerDocentes) // Ruta para obtener todos los Docentes

router.get("/:id", obtenerDocente) // Ruta para obtener un Docente por su id

router.post("/", crearDocente) // Ruta para crear un nuevo Docente

router.put("/:id", actualizarDocente) // Ruta para actualizar un Docente por su id

router.delete("/:id", eliminarDocente) // Ruta para eliminar un Docente por su id

module.exports = router // Exportamos el router para poder usarlo en el archivo principal de la aplicación