const mongoose = require("mongoose") // Importamos mongoose para poder definir el esquema de la materia

const materiaSchema = new mongoose.Schema({ // Definimos el esquema de la materia
    codigo: { // Definimos el campo codigo como un string único
        type: String,
        unique: true
    },
    nombre: String, // Definimos el campo nombre como un string
    descripcion: String,// Definimos el campo descripcion como un string
    cargaHoraria: Number,// Definimos el campo cargaHoraria como un número
    estado: String// Definimos el campo estado como un string
}, {
    versionKey: false // Desactivamos la versión del documento para que no se guarde el campo __v en la base de datos
})

const Materia = mongoose.model("Materia", materiaSchema)

module.exports = Materia
