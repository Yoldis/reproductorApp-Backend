const bcryptjs = require('bcryptjs');
const { request, response } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { v4: uuidv4 } = require('uuid');

const Usuario = require("../models/usuarioModel");
const { generarToken } = require('../helpers/generarToken');
const { deleteFile } = require('../helpers/cloudinary');

const imgDefault = 'https://res.cloudinary.com/dljqyy9l7/image/upload/v1694990391/MusicApp/Perfil/yk0adqwmt615fkpezdgx.jpg';

const pathImgPerfil = 'MusicApp/Perfil/'
const type = 'image';

const registerController = async(req = request, res = response) => {

    const {nombre, correo, password} = req.body;

    try {
        const existeUsuario = await Usuario.findOne({correo});
        if(existeUsuario){
            return res.status(400).json({
                correo:{
                    msg:`El correo ${correo} ya existe`
                }
            })
        }

        const usuario = new Usuario({nombre, correo, password, img:imgDefault});

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(String(password), salt);

        const [token, usuarioDB] = await Promise.all([
            generarToken(usuario.id),
            usuario.save()
        ])


        res.status(200).json({
            msg:'Usuario creado con exito!',
            usuario:usuarioDB,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Algo salio mal al registrar el usuario'
        })
    }
}



const loginController = async(req = request, res = response) => {

    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});
        
        const verifyPassword = bcryptjs.compareSync(password, usuario.password);

        if(!verifyPassword){
            return res.status(400).json({
                password:{
                    msg:'Password Incorrecto'
                }
            })
        }

        const token = await generarToken(usuario.id);

        res.status(200).json({
            msg:'Bienvenido de Nuevo!',
            usuario,
            token
        })   
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            msg:'Algo salio mal al iniciar Sesion'
        })
    }
}


const tokenController = (req = request, res= response) => {
    const usuario = req.usuario;

    res.status(200).json({
        usuario
    })
}


const updateProcfile = async(req = request, res = response) => {

    const{id} = req.params;
    const{nombre, img} = req.body;
    
    try {

        const usuario  = await Usuario.findById(id);
        usuario.nombre = nombre;

        if(img){
            const urlCortado = usuario.img.split('/');
            if(usuario.img !== imgDefault) deleteFile(urlCortado, pathImgPerfil, type);
            usuario.img = img
        }
        
        await usuario.save();

        res.status(200).json({
            msg:'Perfil',
            usuario
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'Algo salio mal - Nombre Perfil'
        })
    }
}


const updateImgProcfile = async(req = request, res = response) => {

    const {img} = req.body;
    try {
        if(img){
            const urlCortado = img.split('/');
            deleteFile(urlCortado, pathImgPerfil, type);
        }
        
    
        const path = `MusicApp/Perfil/${uuidv4()}`;
        const {tempFilePath} = req.files.archivo;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath, {public_id:path});
    
        res.status(200).json({
            img:secure_url
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'Error al subir la Imagen'
        })
    }
    
}


const cancelImg = async(req = request, res = response) => {
    const{id, img} = req.body;

    try {
        const usuario = await Usuario.findById(id);

        const urlCortado = img.split('/');
        if(img !== imgDefault) deleteFile(urlCortado, pathImgPerfil, type);

        res.status(200).json({
            msg:'Cancelado'
        })

    } catch (error) {
        res.status(500).json({
            msg:'Error al cancelar - Imagen'
        })
    }
    
}

module.exports = {
    registerController,
    loginController,
    tokenController,
    updateProcfile,
    updateImgProcfile,
    cancelImg
}