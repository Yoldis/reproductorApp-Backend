const{Router} = require('express');
const { check } = require('express-validator');

const { importMusic, getMusic, deleteMusic, deleteAll, updateMuiscFavorito } = require('../controller/musicController');
const { existeArchivo } = require('../middleware/validarArchivo');
const { validarToken } = require('../middleware/validarToken');
const { validarCampos } = require('../helpers/validarCampos');
const { existeMusica, existeUsuario } = require('../middleware/validarEnDb');

const router = Router();

router.get('/:id', getMusic);


router.post('/', [
    validarToken,
    check('id', 'El id no es valido').isMongoId(),
    existeArchivo,
    validarCampos,
], importMusic);


router.delete('/eliminarTodas/:userId', [
    validarToken,
    check('userId', 'El id no es valido').isMongoId(),
    check('userId').custom(existeUsuario),
    validarCampos
], deleteAll);


router.delete('/:id', [
    validarToken,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom((id) => existeMusica(id)),
    validarCampos,
], deleteMusic);

router.put('/:id', [
    validarToken,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom((id) => existeMusica(id)),
    validarCampos,
], updateMuiscFavorito);



module.exports = router;