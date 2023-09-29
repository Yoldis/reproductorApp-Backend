const{Schema, model} = require('mongoose');

const MusicaActualSchema = Schema({

    random:{type:Boolean, default:false},

    repetir:{type:Boolean, default:false},

    minutoActual:{type:Number},

    musica:{
        type:Schema.Types.ObjectId,
        required:true
    },

    usuario:{
        type:Schema.Types.ObjectId,
        required:true
    },
})

MusicaActualSchema.methods.toJSON = function(){
    const{ __v, _id, ...musica} = this.toObject();
    musica.uid = _id;
    return musica;
}

module.exports = model('MusicaActual', MusicaActualSchema);