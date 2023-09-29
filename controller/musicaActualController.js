const { response, request } = require("express");
const MusicaActual = require("../models/musicaActualModel");
const Musica = require("../models/musicModel");

const musicaActualController = async(req = request, res = response) => {
    const data = req.body;

    try{
        await MusicaActual.updateOne({usuario:data.usuario}, data, {upsert:true});
        res.status(200).json({
            msg:'Musica Actual - Exito!',
        });

    }catch(error){
        res.status(500).json({
            msg:'Algo salio mal - guardar musica actual'
        })
    }

}


const getMusicaActual = async(req = request, res = response) => {
    const{id} = req.params;

    try{
        const {random, repetir, minutoActual, musica:musicaActual} = await MusicaActual.findOne({usuario:id});
        const musica = await Musica.findById(musicaActual);

        res.status(200).json({
            msg:'Musica Actual',
            random, repetir, minutoActual,
            data:musica
        })
    }catch(error){
        res.status(500).json({
            msg:'Algo salio mal - conseguir musica Actual'
        })
    }
}

module.exports = {
    musicaActualController,
    getMusicaActual
}