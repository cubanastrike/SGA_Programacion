const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const path = require("node:path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })

const Usuario = require("./models/Usuario")

async function nuevoUsuario() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("No se encontró MONGO_URI en backend/.env")
        }

        await mongoose.connect(process.env.MONGO_URI)

        const email = "consulta@sga.com"
        const existente = await Usuario.findOne({ email })
        if (existente) {
            console.log(`El usuario ${email} ya existe en la base ${mongoose.connection.name}`)
            return
        }

        const password = "claveUsuario123"
        const hash = await bcrypt.hash(password, 10)
        const usuario = new Usuario({
            nombre: "Usuario de consulta",
            email,
            password: hash,
            rol: "usuario"
        })

        await usuario.save()
        console.log(`Usuario de consulta creado en la base ${mongoose.connection.name}`)
        console.log("email:", email)
    } catch (error) {
        console.error("Error al crear el usuario de consulta:", error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
    }
}

nuevoUsuario()
