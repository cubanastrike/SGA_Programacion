require("dotenv").config() // Importamos dotenv para poder usar las variables de entorno definidas en el archivo .env

const express = require("express") // Importamos express para poder crear el servidor de la API
const cors = require("cors") // Importamos cors para poder permitir el acceso a la API desde otros dominios

const conectarDB = require("./config/database") // Importamos la función conectarDB para poder conectarnos a la base de datos
const alumnosRoutes = require("./routes/alumnos.routes") // Importamos las rutas de alumnos para poder usarlas en el servidor

const app = express() // Creamos una instancia de express para poder usar sus funcionalidades

app.use(express.json()) // Middleware para poder recibir datos en formato JSON en las peticiones de la API
app.use(cors()) // Middleware para permitir el acceso a la API desde otros dominios
app.use("/alumnos", alumnosRoutes) // Middleware para usar las rutas de alumnos en la API, indicando que todas las rutas de alumnos estarán bajo el prefijo /alumnos

const PORT = process.env.PORT // Definimos el puerto en el que se ejecutará el servidor, tomando el valor de la variable de entorno PORT definida en el archivo .env

conectarDB() // Llamamos a la función conectarDB para conectarnos a la base de datos

console.log("Ejecutado con nodemon") // Mensaje que indica que el servidor se está ejecutando con nodemon, lo que permite reiniciar automáticamente el servidor cuando se detectan cambios en el código

app.listen(PORT, () => { // Iniciamos el servidor en el puerto definido en la variable PORT
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})


// Creo un middleware
// app.use((req, res, next) => {
//     console.log(req.method)
//     console.log(req.url)
//     next()
// })



//el archivo server.js es el punto de entrada de la aplicación, donde se configura el servidor, se conectan las rutas y se establece la conexión con la base de datos.