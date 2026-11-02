const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const Usuario = require("./models/Usuario");

const crearUsuario = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("No se encontró MONGO_URI en backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        const email = "mati@gmail.com";
        const password = "password123";

        const existente = await Usuario.findOne({ email });
        if (existente) {
            console.log(`El usuario ${email} ya existe en la base ${mongoose.connection.name}`);
            return;
        }

        const hash = await bcrypt.hash(password, 10);

        const usuario = new Usuario({
            nombre: "Matias",
            email,
            password: hash,
            rol: "admin"
        });


        await usuario.save();
        console.log(`Usuario creado exitosamente en la base ${mongoose.connection.name}`);
        console.log("email:", email);
    } catch (error) {
        console.error("Error al crear el usuario:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }


};

crearUsuario();