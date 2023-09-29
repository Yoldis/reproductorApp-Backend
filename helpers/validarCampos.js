const { request, response } = require("express");
const { validationResult } = require("express-validator");


const validarCampos = (req = request, res = response, next) => {

    const resul = validationResult(req);
    if(!resul.isEmpty()){
        return res.status(400).json(resul.mapped());
    }
    
    next();
}


module.exports = {
    validarCampos
}