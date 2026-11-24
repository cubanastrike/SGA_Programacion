const jws = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
        const token = authHeader.split(' ')[1];
    
        const usuario = jws.verify(token, process.env.JWT_SECRET);
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};
module.exports = {verifyToken}
