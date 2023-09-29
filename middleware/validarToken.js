const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');


const validarToken = async(req = request, res = response, next) => {

    const token  = req.header('x-token');

    if(!token){
        return res.status(400).json({
            token:'No hay token en la peticion'
        })
    }

    try {
        const {id} = jwt.verify(token, process.env.SECRETKEYTOKEN);

        const usuario = await Usuario.findById(id);
        if(!usuario){
            return res.status(400).json({
                token:'No existe el usuario'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(400).json({
            token:'Token no valido'
        })
    }
}


module.exports = {
    validarToken
}