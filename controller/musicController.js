const { request, response } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { v4: uuidv4 } = require('uuid');
const {format} = require('date-fns');
const {esLocale} = require('date-fns/locale/es');

const Musica = require("../models/musicModel");
const { deleteFile } = require("../helpers/cloudinary");


const imgDefaultMusic = 'https://res.cloudinary.com/dljqyy9l7/image/upload/v1694993573/MusicApp/MusicImg/sje9jskc0glwyvq1ijgv.png';
const pathMusic = 'MusicApp/Music/';
const type = 'video';

const getMusic = async(req = request, res = response) => {

    const {id} = req.params;

    try {
        const musica = await Musica.find({usuario:id});

        res.status(200).json({
            msg:'Get',
            data:musica
        })
    } catch (error) {
        res.status(500).json({
            msg:'Error al conseguir las musica'
        })
    }
} 


const importMusic = async(req = request, res = response) => {

    let archivos = req.files.archivo;
    const usuario = req.usuario;
    let data = [];

    try {
        if(!archivos.length) archivos = [archivos];

        const promesas = archivos.map(async(file) => {
            let nombre = file.name;
            nombre = nombre.split('.');
            let musica = await Musica.findOne({usuario:usuario.id, nombre:nombre[0]});
            if(!musica){
                const path = `MusicApp/Music/${usuario.id}/${uuidv4()}`;
                const {secure_url, duration} = await cloudinary.uploader.upload(file.tempFilePath, {resource_type: "video", public_id:path});

                const duracion = (duration / 60);
                const minutos = String(duracion).split('.')[0];
                const segundos =  String((Number('0.' + String(duracion).split('.')[1]) * 60)).split('.')[0];
                const fecha = format(new Date(), 'dd MMM yyyy', {locale:esLocale});
                
                return {
                    nombre:nombre[0] || 'Anonima',
                    url:secure_url,
                    img:imgDefaultMusic,
                    duracion:`${minutos}:${segundos}`,
                    fecha,
                    usuario:usuario.id
                }
            }
            return null;
        });
        
        data = await Promise.all(promesas);
        
        data = data.map((file) => {
            if(file !== null){
                const musica = new Musica(file);
                return musica.save();
            }

            return null
        })
        
        data = (await Promise.all(data)).filter(file => file !== null);

        res.status(200).json({
            msg:'Musica Importada con exito!',
            data,
        })
        
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'Error al subir Archivo'
        })
    }
}


const deleteMusic = async(req = request, res = response) => {

    const{id} = req.params;
    try{
        let musica = await Musica.findById(id);
        if(musica.url){
            const urlCortado = musica.url.split('/');
            deleteFile(urlCortado, `${pathMusic + musica.usuario}/`, type);
            await Musica.findByIdAndDelete(id);
        }
        

        res.status(200).json({
            msg:'Eliminado con exito!',
            musica
        })
    
    }catch(error){
        console.log(error)
        res.status(500).json({
            msg:'Algo salio mal al eliminar la musica'
        })
    }
    
    
}


const deleteAll = async(req = request, res = response) => {

    const {userId} = req.params;

    try {
        let musica = await Musica.find({usuario:userId}, 'url uid');

        if(musica.length === 0){
            return res.status(400).json({
                msg:'No hay musicas para eliminar'
            })
        }

        const promesa = musica.map(async(m)=> {
            const urlCortado = m.url.split('/');
            deleteFile(urlCortado, `${pathMusic + userId}/`, type);
            return await Musica.findByIdAndDelete(m.id, {strict:true});
        })

        await Promise.all(promesa);

        res.status(200).json({
            msg:'Eliminar todas',
            data:[]
         })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'Error al eliminar todas las musica'
        })
    }
    
}

const updateMuiscFavorito = async(req = request, res = response) => {
    const{id} = req.params;

    try{
        let musica = await Musica.findById(id);
        musica.favorito ? musica.favorito = false : musica.favorito = true;
        await musica.save();

        res.status(200).json({
            msg:'Actualizado con exito!',
            data:musica
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:'Error al actualizar la musica'
        })
    }
}

module.exports = {
    importMusic,
    getMusic,
    deleteMusic,
    deleteAll,
    updateMuiscFavorito
}