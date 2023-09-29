const{Schema, model} = require('mongoose');


const UsuarioSchema = Schema({

    nombre:{
        type:String,
        required:[true, 'El nombre es requerido']
    },

    correo:{
        type:String,
        required:[true, 'El correo es requerido'],
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    img:{type:String}
})


UsuarioSchema.methods.toJSON = function(){
    const{__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);