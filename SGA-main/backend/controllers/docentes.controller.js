// controllers maneja la lógica de negocio de la aplicación, es decir, las funciones que se ejecutan cuando se reciben las peticiones HTTP en las rutas definidas en routes

const Docente = require("../models/Docente") // Importamos el modelo de datos de los Docentes para poder usarlo en las funciones del controlador

async function obtenerDocentes(req, res) { // Función para obtener todos los Docentes de la base de datos
    const docentes = await Docente.find() // Usamos el método find() del modelo Docente para obtener todos los documentos de la colección de Docentes en la base de datos
    res.json(docentes) // Respondemos con un JSON que contiene todos los Docentes obtenidos de la base de datos
}

async function obtenerDocente(req, res) {
    const docente = await Docente.findOne({ // Usamos el método findOne() del modelo Docente para obtener un documento de la colección de Docentes en la base de datos que coincida con el dni proporcionado en los parámetros de la ruta
        dni: Number(req.params.id)
    }) // Convertimos el parámetro id a número para poder compararlo con el campo dni de los documentos de la colección de Docentes
    if (!docente) { // Si no se encuentra un Docente con el dni proporcionado, respondemos con un mensaje de error y un código de estado 404
        return res.status(404).json({
            mensaje: "Docente no encontrado"
        })
    }
    res.json(docente) // Si se encuentra un Docente con el dni proporcionado, respondemos con un JSON que contiene los datos del Docente obtenido de la base de datos
}

async function crearDocente(req, res) {
    const { dni, nombre, especialidad, correo } = req.body // Desestructuramos los datos del Docente que se envían en el cuerpo de la petición para poder usarlos en la creación del nuevo Docente
    if (!dni || !nombre || !especialidad || !correo) { // Si alguno de los campos del Docente no se envía en el cuerpo de la petición, respondemos con un mensaje de error y un código de estado 400
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        })
    }
    if (typeof nombre !== "string") {
        return res.status(400).json({
            mensaje: "El nombre debe ser un texto"
        })
    }
    if (typeof dni !== "number") {
        return res.status(400).json({
            mensaje: "El dni debe ser un número"
        })
    }
    const existe = await Docente.findOne({ // Usamos el método findOne() del modelo Docente para verificar si ya existe un Docente con el mismo dni en la base de datos
        dni
    })
    if (existe) { // Si ya existe un Docente con el mismo dni, respondemos con un mensaje de error y un código de estado 400
        return res.status(400).json({
            mensaje: "El dni ya existe"
        })
    }
    const nuevoDocente = await Docente.create({ // Usamos el método create() del modelo Docente para crear un nuevo documento en la colección de Docentes en la base de datos con los datos proporcionados en el cuerpo de la petición
        dni,
        nombre,
        especialidad,
        correo
    })
    res.status(201).json(nuevoDocente) // Respondemos con un JSON que contiene los datos del nuevo Docente creado en la base de datos y un código de estado 201
}

async function actualizarDocente(req, res) {
    const { nombre, especialidad, correo } = req.body
    const docente = await Docente.findOneAndUpdate( // Usamos el método findOneAndUpdate() del modelo Docente para actualizar un documento de la colección de Docentes en la base de datos que coincida con el dni proporcionado en los parámetros de la ruta
        { dni: Number(req.params.id) }, // Convertimos el parámetro id a número para poder compararlo con el campo dni de los documentos de la colección de Docentes
        { nombre, especialidad, correo }, // Los datos que se enviarán en el cuerpo de la petición para actualizar el Docente
        { returnDocument: "after" } // La opción returnDocument: "after" indica que queremos que el método findOneAndUpdate() nos devuelva el documento actualizado después de la actualización
    )
    if (!docente) {
        return res.status(404).json({
            mensaje: "Docente no econtrado"
        })
    }

    res.json(docente)
}

async function eliminarDocente(req, res) {
    const docente = await Docente.findOneAndDelete( // Usamos el método findOneAndDelete() del modelo Docente para eliminar un documento de la colección de Docentes en la base de datos que coincida con el dni proporcionado en los parámetros de la ruta
        { dni: Number(req.params.id) } // Convertimos el parámetro id a número para poder compararlo con el campo dni de los documentos de la colección de Docentes
    )
    if (!docente) {
        return res.status(404).json({
            mensaje: "Docente no econtrado"
        })
    }

    res.json({ mensaje: "Docente eliminado correctamente" })
}

module.exports = {
    obtenerDocentes,
    obtenerDocente,
    crearDocente,
    actualizarDocente,
    eliminarDocente
} // Exportamos las funciones del controlador de Docentes para poder usarlas en las rutas de la API