const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');


class Server {

    constructor(){

        // Definiendo Variables de la clase
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            auth:'/api/auth/',
            music:'/api/music/',
            musicActual:'/api/musicActual/'
        }


        // Llamando metodo de coneccion a DB
        this.conectarAMongoDB();

        // Llamando metodos de la clase
        this.middleware();
        this.routes();
    }

    // Definiendo metodo de coneccion a DB
    async conectarAMongoDB(){
        await dbConnection();
    }

    // Definiendo Metodos de la clase
    middleware(){
        this.app.use(cors());
        this.app.use(express.static('public'));
        this.app.use(express.json());

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }


    routes(){
        this.app.use(this.path.auth, require('../routes/authRoute'));
        this.app.use(this.path.music, require('../routes/musicRouter'));
        this.app.use(this.path.musicActual, require('../routes/musicaActualRouter'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor lentado en el puerto ${this.port}`)
        })
    }

}


module.exports = Server