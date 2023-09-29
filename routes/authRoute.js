const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../helpers/validarCampos');
const { existeCorreo, existeUsuario } = require('../middleware/validarEnDb');
const { registerController, loginController, tokenController, updateImgProcfile, updateProcfile, cancelImg } = require('../controller');
const { validarToken } = require('../middleware/validarToken');


const router = Router();

router.post('/register', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe ser caracteres').isString(),
    
    check('correo', 'El correo es obligatorio').notEmpty(),
    check('correo', 'El correo no es valido').isEmail(),

    check('password', 'La contrasena es obligatoria').notEmpty(),
    check('password', 'La contrasena debe tener al menos 6 caracteres').isLength({min:6}),

    validarCampos
],  registerController)


router.post('/login', [

    check('correo', 'El correo es obligatorio').notEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom((correo) => existeCorreo(correo)),

    check('password', 'La contrasena es obligatoria').notEmpty(),
    check('password', 'La contrasena debe tener al menos 6 caracteres').isLength({min:6}),
    validarCampos

], loginController)


router.get('/validarToken', validarToken, tokenController);


router.put('/updateProcfile/:id', [
    validarToken,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuario),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe ser caracteres').isString(),
    validarCampos
],  updateProcfile)


router.put('/updateImgProcfile', updateImgProcfile);


router.put('/cancelImg',[
    // validarToken,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuario),
    validarCampos,
], cancelImg);



module.exports = router;