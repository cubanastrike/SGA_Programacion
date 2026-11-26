const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                mensaje: "Primero debés autenticarte"
            })
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: "No tenés permisos para esta operación"
            })
        }

        return next()
    }
}

module.exports = { verificarRol }
