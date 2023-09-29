const{Schema, model} = require('mongoose');

const MusicSchema = Schema({

    nombre:{
        type:String,
        required:true
    },

    url:{
        type:String,
        required:true
    },

    favorito:{
        type:Boolean,
        default:false
    },

    img:{
        type:String
    },

    duracion:{
        type:String
    },

    fecha:{
        type:String
    },
    
    usuario:{
        type:Schema.Types.ObjectId,
        required:true
    }

})

MusicSchema.methods.toJSON = function(){
    const{ __v, _id, ...musica} = this.toObject();
    musica.uid = _id;
    return musica;
}

module.exports = model('Musica', MusicSchema);