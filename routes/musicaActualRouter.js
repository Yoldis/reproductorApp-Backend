const{Router} = require('express');
const { musicaActualController, getMusicaActual } = require('../controller/musicaActualController');

const router = Router();

router.post('/', musicaActualController);
router.get('/:id', getMusicaActual);


module.exports = router;