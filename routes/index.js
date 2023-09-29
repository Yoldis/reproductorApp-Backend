const auth = require('./authRoute');
const usuarios = require('./usuarioRouter');

module.exports = {
    ...auth,
    ...usuarios
}