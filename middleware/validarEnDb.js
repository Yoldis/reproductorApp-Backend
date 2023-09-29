
const Usuario = require("../models/usuarioModel");
const Musica = require('../models/musicModel');

const existeCorreo = async(correo) =>{

    const existeCorreo = await Usuario.findOne({correo});
    if(!existeCorreo){
        throw new Error(`No existe el correo ${correo}`);
    }
}

const existeUsuario = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    
    if(!existeUsuario){
        throw new Error(`No existe el usuario`);
    }
}

const existeMusica = async(id) => {
    const existeMusica = await Musica.findById(id);
    
    if(!existeMusica){
        throw new Error(`No existe la musica`);
    }
}





module.exports = {
    existeCorreo,
    existeUsuario,
    existeMusica
}