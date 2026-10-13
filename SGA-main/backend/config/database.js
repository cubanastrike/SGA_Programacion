// Importa Mongoose para poder conectar Node.js con MongoDB.
const mongoose = require("mongoose")

// Función que se encarga de conectar la aplicación con la base de datos.
async function conectarBD(){ //async => Indica que la función es asíncrona, lo que permite usar await dentro de ella.
    try { //try=> Intenta ejecutar el código dentro de este bloque.
        // Usa la dirección de MongoDB guardada en la variable MONGO_URI.
        await mongoose.connect(process.env.MONGO_URI)
//await => Espera a que la conexión se realice antes de continuar con el código.
        // Informa que la conexión se realizó correctamente.
        console.log("Base de datos conectada")
    } catch (error) { //catch => Captura cualquier error que ocurra dentro del bloque try. y error es el objeto que contiene información sobre el error.
        // Muestra el error si MongoDB no pudo conectarse.
        console.log(error) //que tipo de error ocurriria?
    }
}

// Permite usar esta función desde server.js.
module.exports = conectarBD //exporta la función conectarBD para que pueda ser utilizada en otros archivos, como server.js, donde se establece la conexión con la base de datos.