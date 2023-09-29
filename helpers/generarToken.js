const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    const secretKey = process.env.SECRETKEYTOKEN;

    return new Promise((resolve, reject) => {

       jwt.sign(
        {id}, secretKey, {expiresIn:'1h'},
        (err, token) => {
            if(err){
                reject('No se pudo generar el token');
            }
            else resolve(token)
        }
       )
    })
}


module.exports = {
    generarToken
}