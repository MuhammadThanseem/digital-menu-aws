var express = require('express');
var router = express.Router();

router.use('/category', require('./category'));
router.use('/product', require('./product'));
router.use('/table', require('./table'));
router.use('/login', require('./login'));
router.use('/cart', require('./cart'));
router.use('/order', require('./order'));

module.exports = router;
