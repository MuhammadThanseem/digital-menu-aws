var express = require('express');
var router = express.Router();
var loginHelper = require('../helper/login-helper');


router.post('/', async (req, res, next) => {
    let body=req.body;
    let loginResponse = await loginHelper.login(body);
    res.json(loginResponse);
});

module.exports = router;