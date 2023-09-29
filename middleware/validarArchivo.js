const { request, response } = require("express");


const existeArchivo = async(req = request, res = response, next) => {

    if(!req.files || !req.files.archivo){
        return res.status(400).json({
            msg:'No hay archivo para subir',
            lala:req.files
        })
    }

    next();
}



module.exports = {
    existeArchivo
}