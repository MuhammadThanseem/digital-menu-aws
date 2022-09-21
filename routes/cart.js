var express = require('express');
var fs = require('fs');
var router = express.Router();
var cartHelper = require('../helper/cart-helper');
var tableHelper = require('../helper/table-helper');


router.post('/add', async (req, res) => {
    let body = req.body;
    let cartResponse = await cartHelper.addToCart(body);
    if (cartResponse.id) {
        let tableResponse = await tableHelper.updateTable(body.table_id, body)
        if (tableResponse) {
            res.json(cartResponse);
        }
    }

});

router.post('/list', async (req, res, next) => {
    let body = req.body;
    let listCart = await cartHelper.getCartData(body);
    res.json(listCart);
});

router.put("/remove/:id", async (req, res) => {
    let cart_id = req.params.id
    let body = req.body;
    let deleteCart = await cartHelper.removeFromCart(cart_id, body);
    res.json(deleteCart);

});

router.put("/update/:id", async (req, res) => {
    let cart_id = req.params.id
    let body = req.body;
    let updateCart = await cartHelper.updateCart(cart_id, body);
    res.json(updateCart);
});

router.get("/getDetails/:id", async (req, res) => {
    let cart_id = req.params.id;
    let cartById = await cartHelper.getCartDetailsUsingId(cart_id);
    res.json(cartById);
});

router.get("/getCartCount/:id", async (req, res) => {
    let cart_id = req.params.id;
    let cartById = await cartHelper.getCartCount(cart_id);
    res.json(cartById);
});

module.exports = router;