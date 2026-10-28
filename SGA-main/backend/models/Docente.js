// El modelo Docente define la estructura de los documentos de la colección de docentes en la base de datos.

const mongoose = require("mongoose") // Importamos mongoose para definir el modelo de datos de los docentes

const docenteSchema = new mongoose.Schema({ // Definimos la estructura de los documentos de docentes
    dni: {
        type: Number,
        unique: true
    },
    nombre: String,
    especialidad: String,
    correo: String
},





{ 
    versionKey: false // Deshabilitamos el campo __v.
}
)

const Docente = mongoose.model("Docente", docenteSchema)

module.exports = Docente
