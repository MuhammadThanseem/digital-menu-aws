var express = require('express');
var fs = require('fs');
var router = express.Router();
var orderHelper = require('../helper/order-helper');


router.post('/create', async (req, res) => {
    const body = req.body;
    let orderResponse = await orderHelper.createOrder(body);
    res.json(orderResponse);
});

router.post('/list', async (req, res, next) => {
    let body = req.body;
    console.log(body);
    let listOrder = await orderHelper.getOrderData(body);
    res.json(listOrder);
});

router.delete("/delete/:id", async (req, res) => {
    let order_id = req.params.id
    let body = req.body;
    let deleteOrder = await orderHelper.deleteOrder(order_id, body);
    res.json(deleteOrder);
});
router.put("/update/:id", async (req, res) => {
    let order_id = req.params.id
    let body = req.body;
    let deleteOrder = await orderHelper.updateOrder(order_id, body);
    res.json(deleteOrder);

});


module.exports = router;